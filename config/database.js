// config/database.js
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize'); // DataTypes aqui é útil
const { Client: PgClient } = require('pg');

const DB_NAME = process.env.DB_NAME || 'bankup_db';
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 5432;

// Função para criar o banco de dados se ele não existir
const createDatabaseIfNotExists = async () => {
  const pgClient = new PgClient({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: 'postgres', // me conecto ao banco inicial do postgres pois ele tem propriedades administrativas, como criar outros bancos.
  });

  try {
    await pgClient.connect();
    console.log(
      'Conectado ao servidor PostgreSQL para verificar/criar o banco de dados.'
    );
    const result = await pgClient.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`
    );
    if (result.rowCount === 0) {
      console.log(
        `Banco de dados "${DB_NAME}" não encontrado. Criando...`
      );
      await pgClient.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(
        `Banco de dados "${DB_NAME}" criado com sucesso.`
      );
    } else {
      console.log(`Banco de dados "${DB_NAME}" já existe.`);
    }
  } catch (error) {
    console.error(
      `Erro ao verificar/criar o banco de dados "${DB_NAME}":`,
      error.message
    );
    throw error;
  } finally {
    await pgClient.end();
    console.log(
      'Desconectado do servidor PostgreSQL (verificação/criação).'
    );
  }
};

// Inicializa a instância do Sequelize
const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging:
      process.env.NODE_ENV === 'dontshow' ? console.log : false, // faz o Sequelize imprimir no console cada query que ele executa
  }
);

// Objeto para armazenar os modelos carregados
const db = {};

// Função para inicializar o Sequelize, carregar modelos, definir associações e sincronizar
const initializeDatabase = async () => {
  try {
    // 1. Garantir que o banco de dados físico exista
    await createDatabaseIfNotExists();

    // 2. Testar a conexão com o banco DB_NAME (a instância do sequelize já foi criada acima)
    await sequelize.authenticate();
    console.log(
      `Conexão com o banco de dados "${DB_NAME}" estabelecida com sucesso via Sequelize.`
    );

    // 3. Carregar modelos
    // Note que passamos 'sequelize' e 'DataTypes' para cada função de definição de modelo
    db.User = require('../modules/user/models/User')(
      sequelize,
      DataTypes
    );
    db.Profile = require('../modules/user/models/Profile')(
      sequelize,
      DataTypes
    );
    db.AuthCode = require('../modules/user/models/AuthCode')(
      sequelize,
      DataTypes
    );
    db.RecurringAccount = require('../modules/financial/models/Recurring')(
      sequelize,
      DataTypes
    );

    // Adicione outros modelos aqui da mesma forma
    

    // 4. Definir associações (depois que TODOS os modelos forem carregados)
    Object.values(db).forEach((model) => {
      if (model.associate) {
        model.associate(db); // Chama o método associate se existir no modelo
      }
    });

    // 5. Sincronizar modelos com o banco de dados
    await sequelize.sync({
      force: false,
      alter: process.env.NODE_ENV === 'development',
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(
        'Modelos sincronizados com o banco (alterações aplicadas se necessário em dev).'
      );
    } else {
      console.log(
        'Modelos sincronizados com o banco (tabelas criadas se não existiam).'
      );
    }

    // Adiciona a instância do Sequelize e o construtor Sequelize ao objeto db para exportação
    db.sequelize = sequelize;
    db.Sequelize = Sequelize; // O construtor Sequelize em si

    // Retornar o objeto db contendo a instância do sequelize e os modelos
    return db;
  } catch (error) {
    console.error(
      'Falha ao inicializar o banco de dados e modelos:',
      error
    );
    throw error;
  }
};

// Exportar a função de inicialização e o objeto db (que será preenchido após a inicialização)
// Se você precisar apenas da função de inicialização para ser chamada no app.js, está ok.
// Exportar 'db' aqui diretamente daria um objeto vazio antes da inicialização.
// É melhor pegar o resultado de 'initializeDatabase()'.
module.exports = {
  initializeDatabase,
  sequelize,
  DataTypes,
  db
};
// Exportar sequelize e DataTypes aqui pode ser útil se você precisar deles
// para definir modelos em testes ou scripts sem passar por initializeDatabase
// (embora geralmente initializeDatabase seja o ponto de entrada).
// O 'db' exportado aqui será preenchido APÓS initializeDatabase() ser chamado e concluído.
// A melhor prática é usar o objeto retornado por `await initializeDatabase()`.
