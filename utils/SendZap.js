const { MessageMedia } = require('whatsapp-web.js');
const { getClient, isReady } = require('./WhatsappClient');

class SendWhatsapp {

    formatNumber(rawNumber) {
        let number = String(rawNumber).replace(/\D/g, '');
        
        if (number.length > 11 && number.startsWith('55')) {
             if (number.length === 13 && number[4] === '9') {
                number = number.slice(0, 4) + number.slice(5);
            }
        } else if (number.length <= 11) {
            if (number.length === 11 && number[2] !== '9') {
                number = number.slice(0, 2) + number.slice(3);
            }
            if (!number.startsWith('55')) {
                number = '55' + number;
            }
        }

        if (!number.endsWith('@c.us')) {
            number = number + '@c.us';
        }
        return number;
    }

    async sendTextMessage(to, message) {
        if (!isReady()) {
            throw new Error('Cliente WhatsApp não está pronto.');
        }
        const client = getClient();
        const formattedTo = this.formatNumber(to);

        try {
            await client.sendMessage(formattedTo, message);
            return true;
        } catch (error) {
            console.error(`Erro ao enviar mensagem de texto para ${formattedTo}:`, error);
            throw error;
        }
    }

    async sendMediaMessage(to, buffer, caption, filename = 'image.png') {
        if (!isReady()) {
            throw new Error('Cliente WhatsApp não está pronto.');
        }
        const client = getClient();
        const formattedTo = this.formatNumber(to);

        try {
            const media = new MessageMedia(
                'image/png',
                buffer.toString('base64'),
                filename
            );
            
            await client.sendMessage(formattedTo, media, { caption: caption });
            return true;
        } catch (error) {
            console.error(`Erro ao enviar mídia para ${formattedTo}:`, error);
            throw error;
        }
    }
}

module.exports = SendWhatsapp;