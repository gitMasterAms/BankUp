// server.js
require('dotenv').config(); // Carregar variáveis de ambiente primeiro
const express = require('express');
const { initializeDatabase } = require('./config/database'); // Ajuste o caminho se necessário

const app = express();
const PORT = process.env.PORT || 3000; // Porta do .env ou padrão 3000

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Variáveis para guardar a instância do Sequelize e os modelos após a inicialização
let dbInstance;

// Função principal para iniciar a aplicação
const startApp = async () => {
  try {
    // 1. Inicializar o banco de dados e obter a instância do Sequelize e modelos
    // initializeDatabase() fará:
    // - Criar o banco "bankup" se não existir.
    // - Conectar com Sequelize.
    // - Definir modelos User e Client com relação 1-para-1.
    // - Sincronizar (criar tabelas se não existirem, ou alterar em dev, SEM FORÇAR/APAGAR).
    dbInstance = await initializeDatabase(); // dbInstance conterá { sequelize, User, Client }

    console.log('Banco de dados pronto para uso.');

    // 2. Configurar rotas AQUI, agora que dbInstance.User e dbInstance.Client estão disponíveis
    // Exemplo de rota simples:
    app.get('/users', async (req, res) => {
      try {
        const users = await dbInstance.User.findAll({
          include: [{ model: dbInstance.Client }] // Exemplo de como usar a associação
        });
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
      }
    });

    app.get('/', (req, res) => {
      res.send(`Servidor rodando! Banco de dados "${process.env.DB_NAME || 'bankup'}" está conectado.`);
    });

    // 3. Iniciar o servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor Express rodando na porta ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV}`);
    });

  } catch (error) {
    console.error('Falha crítica ao iniciar a aplicação:', error);
    process.exit(1); // Sair se o DB não puder ser inicializado
  }
};

// Iniciar a aplicação
startApp();