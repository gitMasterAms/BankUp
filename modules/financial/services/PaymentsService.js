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

class PaymentsService {
  constructor(paymentsRepository, recurringRepository) {
    this.paymentsRepository = paymentsRepository;
    this.recurringRepository = recurringRepository;
  }

  /**
   * Registra um novo pagamento.
   * @param {object} paymentData - Dados do pagamento.
   * @returns {Promise<object>} O pagamento registrado.
   */
  async register({ userId, account_id, amount_paid, payment_date, payment_method, payment_status, penalty_applied }) {
    try {
      // A validação continua usando o userId (vindo do token) para garantir
      // que o usuário é o dono da conta recorrente.
      const recurringAccount = await this.recurringRepository.findById(account_id);
      if (!recurringAccount || recurringAccount.userId !== userId) {
        throw new Error('CONTA_NAO_ENCONTRADA');
      }

      // Cria o registro do pagamento sem o campo 'userId'.
    await this.paymentsRepository.create({
        account_id,
        amount_paid,
        payment_date,
        payment_method,
        payment_status,
        penalty_applied,
        created_at: new Date(),
        updated_at: new Date()
      });

      const qrCodePix = QrCodePix({
  version: '01',
  key: 'nicolasggomes2@gmail.com',
  name: payee,
  city: 'SAO PAULO',
  transactionId: `BANKUP${Date.now()}`.slice(0,25), 
  message: 'Pay me :)',
  cep: '99999999',
  value: amount,
});

    const payload = qrCodePix.payload();

    // QR Code como buffer para embed via cid
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

      <p>Valor: <strong>R$ ${amount.toFixed(2)}</strong></p>
      <p>Descrição: ${description}</p>
      <br>
      <p>Caso já tenha realizado o pagamento, desconsidere este e-mail.</p>
      <p>Atenciosamente,</p>
      <p>Equipe BANKUP</p>
    `;

    await EmailService.sendEmail(description, title, content, [
      {
        filename: 'pix.png',
        content: qrBuffer,
        cid: 'pixqrcode'
      }
    ]);      

    } catch (err) {
      console.error('PaymentsService.register ERRO:', err);
      throw err;
    }
  }

  async getAllByUser(userId) {
    // Esta chamada agora funciona corretamente com o novo repositório.
    return await this.paymentsRepository.findByUserId(userId);
  }

  async getById(id) {
    return await this.paymentsRepository.findById(id);
  }

  async updateById(id, data) {
    data.updated_at = new Date();
    return await this.paymentsRepository.updateById(id, data);
  }

  async deleteById(id) {
    return await this.paymentsRepository.deleteById(id);
  }
}

module.exports = PaymentsService;
