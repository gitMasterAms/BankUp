require('dotenv').config();
const express = require('express');
const { initializeDatabase } = require('./config/database');
const { startDailyJob } = require('./config/dailyOverdueCheck');
const { initializeClient, restartClient } = require('./utils/WhatsappClient');

process.on('uncaughtException', (err) => {
    const errorMsg = err.message || JSON.stringify(err);
    if (errorMsg.includes('EBUSY') && errorMsg.includes('.wwebjs_auth')) {
        console.log('⚠️ [SISTEMA] O Windows bloqueou um arquivo temporário. Erro ignorado para manter servidor online.');
    } else {
        console.error('Erro crítico não tratado:', err);
        process.exit(1); 
    }
});

process.on('unhandledRejection', (reason, promise) => {
    const errorMsg = reason instanceof Error ? reason.message : JSON.stringify(reason);
    
    if (errorMsg.includes('EBUSY') || (reason.code && reason.code === 'EBUSY')) {
        console.log('⚠️ [SISTEMA] Bloqueio de arquivo detectado (EBUSY) na desconexão. O servidor permanece estável.');
    } else {
        console.error('Rejeição não tratada:', reason);
    }
});

const app = express();
const PORT = process.env.PORT || 3000;

let db;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startApp() {
  try {
    console.log('Inicializando o banco de dados...');
    db = await initializeDatabase();
    console.log('Banco de dados inicializado com sucesso.');

    const startWhatsApp = () => {
        initializeClient()
            .then(() => console.log('WhatsApp conectado com sucesso.'))
            .catch((err) => {
                console.error('Falha ao iniciar WhatsApp inicial. Tente reiniciar via rota.', err.message);
            });
    };

    startWhatsApp();

    app.get('/whatsapp/restart', async (req, res) => {
        console.log('Solicitação manual de reinício do WhatsApp recebida.');
        try {
            await restartClient();
            res.json({ message: 'Processo de reinício iniciado. Verifique o terminal para o novo QR Code.' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao tentar reiniciar', details: error.message });
        }
    });

    const createRoutes = require('./routes');
    const cors = require('cors');
    app.use(cors());
    app.use(createRoutes(db));
    
    startDailyJob(db);

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startApp();