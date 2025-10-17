require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
const { initZap } = require('./utils/SendZap'); // ✅ caminho certo!

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

async function startApp() {
  try {
    console.log('Inicializando o banco de dados...');
    const db = await initializeDatabase();
    console.log('Banco de dados inicializado com sucesso.');

    // 🚀 Inicializa o WhatsApp e exibe o QR no terminal
    await initZap();

    // 🔗 Rotas
    const createRoutes = require('./routes');
    app.use(createRoutes(db));

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startApp();
