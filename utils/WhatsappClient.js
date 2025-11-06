const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;
let isClientReady = false;

function initializeClient() {
    console.log('Iniciando cliente WhatsApp...');
    client = new Client({
        authStrategy: new LocalAuth()
    });

    // Isso transforma a inicialização em uma Promise
    return new Promise((resolve, reject) => {
        client.on('qr', qr => {
            console.log('Escaneie o QR Code do WhatsApp com seu celular:');
            qrcode.generate(qr, { small: true });
        });

        client.on('ready', () => {
            console.log('Cliente WhatsApp está pronto!');
            isClientReady = true;
            resolve(true); // Resolve a Promise (só agora o app.js vai continuar)
        });

        client.on('auth_failure', msg => {
            console.error('Falha na autenticação do WhatsApp:', msg);
            isClientReady = false;
            reject(new Error(`Falha na autenticação: ${msg}`)); // Rejeita a Promise
        });

        client.on('disconnected', (reason) => {
            console.log('Cliente WhatsApp foi desconectado:', reason);
            isClientReady = false;
        });

        // O 'initialize' agora é chamado dentro da Promise
        client.initialize().catch(err => {
            console.error('Erro ao inicializar o cliente WhatsApp:', err);
            reject(err);
        });
    });
}

function getClient() {
    return client;
}

function isReady() {
    return isClientReady;
}

module.exports = {
    initializeClient,
    getClient,
    isReady
};