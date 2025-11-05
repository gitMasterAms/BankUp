require('dotenv').config();
const { QrCodePix } = require('qrcode-pix');
const qrcode = require('qrcode');
const sendEmail = require('../../../utils/SendEmail');
const schedulePayment = require('../../../utils/schedulePayment');
const moment = require('moment');

class PaymentsService {
  constructor(paymentsRepository, recurringService) {
    this.paymentsRepository = paymentsRepository;
    this.recurringService = recurringService;
    this.emailService = new sendEmail();
  }

  async sendPaymentEmail(paymentId, accountId, pixKey) {
    try {
      const account = await this.recurringService.getById(accountId);
      const payment = await this.paymentsRepository.findById(paymentId);

      if (!account || !payment) {
        console.error(`Conta (${accountId}) ou Pagamento (${paymentId}) não encontrado para envio de e-mail.`);
        return;
      }

      const pixValue = (payment.final_amount && parseFloat(payment.final_amount) > 0)
        ? parseFloat(payment.final_amount)
        : parseFloat(payment.amount);

      const qrCodePix = QrCodePix({
        version: '01',
        key: pixKey,
        name: account.name,
        city: 'SAO PAULO',
        transactionId: `BANKUP${Date.now()}`.slice(0, 25),
        message: payment.description,
        cep: '99999999',
        value: pixValue,
      });

      const payload = qrCodePix.payload();
      const qrBuffer = await qrcode.toBuffer(payload);
      const title = 'Cobrança BANKUP - Pagamento via PIX';
      const content = `
        <p>Prezado usuário do BANKUP,</p>
        <p>Você possui uma cobrança registrada em nossa plataforma. Para realizar o pagamento, utilize o QR Code ou o código PIX abaixo:</p>
        <div style="text-align: center; margin: 20px 0;">
            <img src="cid:pixqrcode" alt="QR Code PIX" style="width: 200px; height: 200px;"/>
        </div>
        <p><strong>Código PIX (copia e cola):</strong></p>
        <p style="word-break: break-all; background: #f4f4f4; padding: 10px; border-radius: 5px; color: #1a1a1a;">
            ${payload}
        </p>
        <p>Valor: <strong>R$ ${pixValue.toFixed(2)}</strong></p>
        <p>Descrição: ${payment.description}</p>
        <br>
        <p>Caso já tenha realizado o pagamento, desconsidere este e-mail.</p>
        <p>Atenciosamente,</p>
        <p>Equipe BANKUP</p>
      `;
      await this.emailService.sendEmail(account.email, title, content, [
        {
          filename: 'pix.png',
          content: qrBuffer,
          cid: 'pixqrcode'
        }
      ]);
      console.log(`E-mail de cobrança enviado para ${account.email} (PaymentID: ${paymentId})`);
    } catch (err) {
      console.error(`Erro ao enviar e-mail agendado para Payment ${paymentId}:`, err);
    }
  }

  async register({
    userId,
    account_id,
    amount,
    description,
    due_date,
    days_before_due_date,
    status,
    fine_amount,
    interest_rate,
    pix_key,
    is_recurring = false,
    installments = 1
  }) {
    try {
      const recurringAccount = await this.recurringService.getById(account_id);
      if (!recurringAccount) {
        throw new Error('CONTA_NAO_ENCONTRADA');
      }

      const totalPayments = is_recurring ? parseInt(installments, 10) : 1;
      const createdPaymentRecords = [];

      for (let i = 0; i < totalPayments; i++) {
        const installmentDueDate = moment(due_date).add(i, 'months').toDate();
        const installmentDescription = totalPayments > 1
          ? `${description} (Parcela ${i + 1}/${totalPayments})`
          : description;

        const paymentRecord = await this.paymentsRepository.create({
          userId,
          account_id,
          amount,
          description: installmentDescription,
          due_date: installmentDueDate,
          status: status || 'pendente',
          fine_amount,
          interest_rate,
          pix_key
        });

        if (i === 0 && process.env.NODE_ENV === 'development') {
          await this.sendPaymentEmail(paymentRecord.payment_id, account_id, pix_key);
        }

        schedulePayment({
          dueDate: installmentDueDate,
          daysBefore: days_before_due_date,
          callback: () => this.sendPaymentEmail(
            paymentRecord.payment_id,
            account_id,
            pix_key
          )
        });

        createdPaymentRecords.push(paymentRecord);
      }

      return createdPaymentRecords;
    } catch (err) {
      console.error('PaymentsService.register ERRO:', err);
      throw err;
    }
  }

  async getAllByRecurring(account_id) {
    return await this.paymentsRepository.findByAccountId(account_id);
  }


  findAll(userId) {
    return this.paymentsRepository.findAll(userId);
  }


  async getById(payment_id) {
    return await this.paymentsRepository.findById(payment_id);
  }

  async updateById(payment_id, data) {
    data.updated_at = new Date();
    return await this.paymentsRepository.updateById(payment_id, data);
  }

  async deleteById(payment_id) {
    return await this.paymentsRepository.deleteById(payment_id);
  }

  async processOverduePayments() {
    console.log(`[${new Date().toISOString()}] Iniciando verificação de pagamentos vencidos...`);
    const overduePayments = await this.paymentsRepository.findPendingAndOverdue();

    if (overduePayments.length === 0) {
      console.log('Nenhum pagamento vencido para atualizar.');
      return;
    }

    console.log(`Encontrados ${overduePayments.length} pagamentos para processar.`);

    for (const payment of overduePayments) {
      try {
        const today = moment();
        const dueDate = moment(payment.due_date);
        
        if (today.isBefore(dueDate)) {
          continue;
        }

        const monthsLate = today.diff(dueDate, 'months');
        const amount = parseFloat(payment.amount);
        const fineAmount = parseFloat(payment.fine_amount);
        const interestRate = parseFloat(payment.interest_rate);

        const interestAmount = amount * (interestRate / 100) * monthsLate;
        const finalAmount = amount + fineAmount + interestAmount;

        const updatedData = {
          status: 'vencido',
          final_amount: finalAmount.toFixed(2)
        };
        await this.paymentsRepository.updateById(payment.payment_id, updatedData);
        console.log(`Pagamento ${payment.payment_id} atualizado. Status: vencido, Valor final: ${updatedData.final_amount}`);

        console.log(`Enviando notificação de vencimento para o pagamento ${payment.payment_id}...`);
        const account = await this.recurringService.getById(payment.account_id);
        if (!account) {
          console.error(`Conta recorrente ${payment.account_id} não encontrada.`);
          continue;
        }
        
        const pixValue = parseFloat(updatedData.final_amount);
        const qrCodePix = QrCodePix({
          version: '01', key: payment.pix_key, name: account.name,
          city: 'SAO PAULO', transactionId: `BANKUP${Date.now()}`.slice(0, 25),
          message: payment.description, cep: '99999999', value: pixValue,
        });

        const payload = qrCodePix.payload();
        const qrBuffer = await qrcode.toBuffer(payload);
        const title = 'Aviso de Vencimento - Cobrança BANKUP';
        const content = `
          <p>Prezado(a) ${account.name},</p>
          <p>Sua cobrança referente a "${payment.description}" venceu.</p>
          <p>O valor foi atualizado com as taxas de atraso e o novo total para pagamento é de <strong>R$ ${pixValue.toFixed(2)}</strong>.</p>
          <p>Utilize o QR Code ou o código PIX abaixo para regularizar sua situação:</p>
          <div style="text-align: center; margin: 20px 0;">
              <img src="cid:pixqrcode" alt="QR Code PIX" style="width: 200px; height: 200px;"/>
          </div>
          <p><strong>Código PIX (copia e cola):</strong></p>
          <p style="word-break: break-all; background: #f4f4f4; padding: 10px; border-radius: 5px; color: #1a1a1a;">
              ${payload}
          </p>
        `;

        await this.emailService.sendEmail(account.email, title, content, [{
          filename: 'pix.png', content: qrBuffer, cid: 'pixqrcode'
        }]);
        console.log(`Notificação para ${account.email} enviada com sucesso.`);
        
      } catch (err) {
        console.error(`Erro ao processar o pagamento ${payment.payment_id}:`, err);
      }
    }
    console.log('Processamento de pagamentos vencidos concluído.');
  }
}

module.exports = PaymentsService;