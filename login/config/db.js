const { Sequelize } = require('sequelize');
const { Client } = require('pg'); // Importar o cliente 'pg' diretamente
require('dotenv').config();

// Configuração do Sequelize (para conectar ao DB_NAME específico)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    dialect: process.env.DB_DIALECT,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

// Função para criar o banco de dados se ele não existir
const createDatabaseIfNotExists = async () => {
  const dbName = process.env.DB_NAME;
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbHost = process.env.DB_HOST;
  const dbPort = parseInt(process.env.DB_PORT, 10);

  // Configuração para conectar a um banco de dados padrão (ex: 'postgres')
  // para poder executar o comando CREATE DATABASE.
  // O usuário DB_USER precisa ter permissão para criar bancos de dados.
  const tempClientConfig = {
    user: dbUser,
    host: dbHost,
    database: 'postgres', // Conecte-se a um banco de dados existente como 'postgres' ou 'template1'
    password: dbPassword,
    port: dbPort,
  };

  const client = new Client(tempClientConfig);

  try {
    await client.connect();
    console.log('Conectado ao servidor PostgreSQL para verificar/criar o banco de dados.');

    // Verificar se o banco de dados alvo (DB_NAME) existe
    const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

    if (result.rowCount === 0) {
      console.log(`Banco de dados "${dbName}" não encontrado. Criando...`);
      await client.query(`CREATE DATABASE "${dbName}"`); // Use aspas duplas para nomes de DB com caracteres especiais ou maiúsculas/minúsculas
      console.log(`Banco de dados "${dbName}" criado com sucesso.`);
    } else {
      console.log(`Banco de dados "${dbName}" já existe.`);
    }
  } catch (error) {
    // Um erro comum aqui é se o usuário DB_USER não tiver permissão para criar bancos.
    // Ou se não conseguir conectar ao banco 'postgres'.
    console.error(`Erro ao verificar/criar o banco de dados "${dbName}":`, error.message);
    // Se você não quiser que o processo continue se o DB não puder ser criado/verificado,
    // você pode relançar o erro ou sair do processo:
    // throw error; // ou process.exit(1);
    // Por enquanto, vamos apenas logar e permitir que o sequelize tente conectar depois.
    // Se o DB não foi criado aqui, o sequelize.authenticate() abaixo provavelmente falhará.
  } finally {
    await client.end();
    console.log('Desconectado do servidor PostgreSQL (verificação/criação).');
  }
};


const connectDB = async () => {
  try {
    // Opcional: pode chamar createDatabaseIfNotExists aqui também se quiser
    // garantir que o DB existe toda vez que `connectDB` é chamado,
    // mas geralmente é melhor fazer isso apenas em `initDB`.
    // await createDatabaseIfNotExists();

    await sequelize.authenticate();
    console.log(`Conexão com o banco de dados "${process.env.DB_NAME}" estabelecida com sucesso via Sequelize.`);
  } catch (error) {
    console.error(`Não foi possível conectar ao banco de dados "${process.env.DB_NAME}" via Sequelize:`, error.message);
    console.error("Detalhes do erro:", error);
    console.error("\nVerifique se o banco de dados existe e as credenciais estão corretas.");
    console.error("Você pode precisar executar 'npm run db:init' para criar o banco e as tabelas.");
    process.exit(1);
  }
};

const initDB = async (forceSync = false) => {
  try {
    // 1. Criar o banco de dados se ele não existir
    await createDatabaseIfNotExists();

    // 2. Agora, conectar usando Sequelize ao DB_NAME (que agora deve existir)
    //    e sincronizar os modelos.
    await sequelize.authenticate(); // Autentica com o DB_NAME
    console.log(`Conexão com "${process.env.DB_NAME}" estabelecida para sincronização.`);

    await sequelize.sync({ force: forceSync, alter: !forceSync && process.env.NODE_ENV === 'development' });
    console.log("Todos os modelos foram sincronizados com sucesso.");
    if (forceSync) console.warn("Sincronização forçada (tabelas recriadas).");

  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error.message);
    // Considere sair do processo se a inicialização falhar criticamente
    process.exit(1);
  }
};


module.exports = { sequelize, connectDB, initDB, createDatabaseIfNotExists /* Opcional exportar */ };