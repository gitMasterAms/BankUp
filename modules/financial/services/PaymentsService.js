/**
 * services/PaymentsService.js
 * * Contém a lógica de negócio para pagamentos.
 * * ATUALIZADO: A criação de pagamento não inclui mais o 'userId' diretamente.
 */
require('dotenv').config();
const { QrCodePix } = require('qrcode-pix');
const qrcode = require('qrcode');
const sendEmail = require('../../../utils/SendEmail');
const EmailService = new sendEmail();
const schedulePayment = require('../../../utils/schedulePayment');
const { initZap, sendZapText, sendZapImage } = require('../../../utils/SendZap');


class PaymentsService {
  constructor(paymentsRepository, recurringService) {
    this.paymentsRepository = paymentsRepository;
    this.recurringService = recurringService;
  }

  /**
   * Registra um novo pagamento.
   * @param {object} paymentData - Dados do pagamento.
   * @returns {Promise<object>} O pagamento registrado.
   */
  async register({ 
      account_id,
      amount,
      description,
      due_date,
      days_before_due_date,
      status,
      penalty,
      pix_key }) {
    try {
      // A validação continua usando o userId (vindo do token) para garantir
      // que o usuário é o dono da conta recorrente.
      const recurringAccount = await this.recurringService.getById(account_id);
      if (!recurringAccount || recurringAccount.account_id !== account_id) {
        throw new Error('CONTA_NAO_ENCONTRADA');
      }

      // Criação do registro de pagamento
      const paymentRecord = await this.paymentsRepository.create({
        account_id,
        amount,
        description,
        due_date,
        status,
        penalty,
        pix_key
      });   
    
        // Função para gerar e enviar o QR Code via e-mail
      const sendPaymentNow = async () => {
        try {
          // Recupera dados atualizados do pagamento e conta
          const account = await this.recurringService.getById(account_id);
          const payment = await this.paymentsRepository.getById(paymentRecord.id);

          // Gera QR Code PIX atualizado
          const qrCodePix = QrCodePix({
            version: '01',
            key: pix_key,
            name: account.name,
            city: 'SAO PAULO',
            transactionId: `BANKUP${Date.now()}`.slice(0,25),
            message: payment.description,
            cep: '99999999',
            value: payment.amount,
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

            <p>Valor: <strong>R$ ${payment.amount.toFixed(2)}</strong></p>
            <p>Descrição: ${payment.description}</p>
            <br>
            <p>Caso já tenha realizado o pagamento, desconsidere este e-mail.</p>
            <p>Atenciosamente,</p>
            <p>Equipe BANKUP</p>
          `;

          await EmailService.sendEmail(account.email, title, content, [
            {
              filename: 'pix.png',
              content: qrBuffer,
              cid: 'pixqrcode'
            }
          ]);

          const mensagemWhats = `
Olá ${account.name}! 💰
Você possui uma cobrança de R$ ${payment.amount.toFixed(2)}.
Descrição: ${payment.description}

Código PIX: ${payload}
`;

    // envia mensagem de texto
    await sendZapText(account.phone, mensagemWhats);
    // envia imagem do QR Code
    await sendZapImage(account.phone, qrBase64, 'QR Code PIX - BANKUP 💳');

          // Futuro: envio de WhatsApp
          // await WhatsAppService.sendMessage(account.phone, `Sua cobrança de R$${payment.amount.toFixed(2)} vence em breve!`);

        } catch (err) {
          console.error('Erro ao enviar cobrança (e-mail/WhatsApp):', err);
        }
      };

      if (process.env.NODE_ENV === 'development'){
      await sendPaymentNow();
      }

      // Agendamento via cron
      schedulePayment({
        dueDate: due_date,
        daysBefore: days_before_due_date,
        callback: sendPaymentNow
      });

      return paymentRecord;

    } catch (err) {
      console.error('PaymentsService.register ERRO:', err);
      throw err;
    }
  }

  async getAllByRecurring(account_id) {
    // Esta chamada agora funciona corretamente com o novo repositório.
    return await this.paymentsRepository.findByAccountId(account_id);
  }

  async getAll() {
    return await this.paymentsRepository.findAll();
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
}

module.exports = PaymentsService;
