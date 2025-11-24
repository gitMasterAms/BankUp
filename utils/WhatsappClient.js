const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;
let isClientReady = false;

function initializeClient() {
    // Se já existir um cliente tentando rodar, mata ele antes de criar outro
    if (client) {
        try {
            client.removeAllListeners(); 
        } catch (e) { console.error('Erro ao limpar listeners antigos:', e.message); }
    }

    client = new Client({
        authStrategy: new LocalAuth(),
        // Aumenta o tempo de autenticação para contas pesadas (60 segundos)
        authTimeoutMs: 60000, 
        puppeteer: {
            headless: true,
            // Argumentos para otimização e evitar travamentos em contas grandes
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process', 
                '--disable-gpu',
                '--disable-logging',
                '--log-level=3'
            ]
        }
    });

    return new Promise((resolve, reject) => {
        client.on('qr', qr => {
            // Só gera QR se não estiver pronto, evita spam no terminal
            if (!isClientReady) {
                qrcode.generate(qr, { small: true });
            }
        });

        client.on('ready', () => {
            console.log('Cliente WhatsApp está pronto!');
            isClientReady = true;
            resolve(true);
        });

        client.on('auth_failure', msg => {
            console.error('Falha na autenticação do WhatsApp:', msg);
            isClientReady = false;
            reject(new Error(`Falha na autenticação: ${msg}`));
        });

        client.on('disconnected', (reason) => {
            // Evita spam de logs se desconectar várias vezes seguidas
            if (isClientReady) {
                console.log('Cliente WhatsApp foi desconectado:', reason);
            }
            isClientReady = false;
            // Importante: Não rejeitamos a Promise aqui pois ela já foi resolvida no 'ready'
        });

        client.initialize().catch(err => {
            // Filtra erro genérico para não poluir log
            if (!err.message.includes('Protocol error')) {
                console.error('Erro ao inicializar o cliente WhatsApp:', err.message);
            }
            reject(err);
        });
    });
}

async function restartClient() {
    if (client) {
        console.log('Reiniciando: Destruindo sessão anterior...');
        try {
            // Remove listeners para parar de ouvir eventos na instância morta
            client.removeAllListeners();
            await client.destroy();
            client = null; // Garante que a variável fique vazia
        } catch (err) {
            console.log('Erro ao destruir cliente (normal se for EBUSY):', err.message);
        }
    }
    
    // Espera 3 segundos para o Windows "respirar" e liberar arquivos
    await new Promise(r => setTimeout(r, 3000));
    
    isClientReady = false;
    // Retorna a promessa para que o endpoint espere terminar
    return initializeClient();
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
    isReady,
    restartClient
};