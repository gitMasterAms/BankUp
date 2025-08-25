require('dotenv').config();
const { QrCodePix } = require('qrcode-pix');
const qrcode = require('qrcode');
const sendEmail = require('../../../utils/SendEmail');
const EmailService = new sendEmail();

class RecurringService {
  constructor(recurringRepository) {
    this.recurringRepository = recurringRepository;
  }

  async register({ userId, description, amount, due_date, payee, pix_key, status }) {
    try {
      // Aqui você poderia fazer alguma verificação extra, como evitar duplicidade
      // Exemplo: se quiser garantir que um mesmo usuário não cadastre a mesma conta com mesma descrição e data
      // const existingAccount = await this.recurringRepository.findByDescriptionAndDate(userId, description, due_date);
      // if (existingAccount) throw new Error('CONTA_DUPLICADA');

      await this.recurringRepository.create({
        userId,
        description,
        amount,
        due_date,
        payee,
        pix_key,
        status
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
      console.error('RecurringService.register ERRO:', err);
      throw err;
    }
  }
    async getAllByUser(userId) {
        return await this.recurringRepository.findByUserId(userId);
    }

    async getById(id) {
        return await this.recurringRepository.findById(id);
    }

    async updateById(id, data) {
        data.updated_at = new Date();
        return await this.recurringRepository.updateById(id, data);
    }

    async deleteById(id) {
        return await this.recurringRepository.deleteById(id);
    }
}

module.exports = RecurringService;