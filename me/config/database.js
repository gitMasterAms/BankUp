// database.js
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const { Client: PgClient } = require('pg'); // Cliente PostgreSQL para criar o DB

const DB_NAME = process.env.DB_NAME || 'bankup';
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 5432;

// Instância do Sequelize (será inicializada após garantir que o DB existe)
let sequelize;

// Função para criar o banco de dados se ele não existir
const createDatabaseIfNotExists = async () => {
  const pgClient = new PgClient({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: 'postgres', // Conectar a um DB padrão para executar CREATE DATABASE
  });

  try {
    await pgClient.connect();
    console.log('Conectado ao servidor PostgreSQL para verificar/criar o banco de dados.');
    const result = await pgClient.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`);
    if (result.rowCount === 0) {
      console.log(`Banco de dados "${DB_NAME}" não encontrado. Criando...`);
      await pgClient.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Banco de dados "${DB_NAME}" criado com sucesso.`);
    } else {
      console.log(`Banco de dados "${DB_NAME}" já existe.`);
    }
  } catch (error) {
    console.error(`Erro ao verificar/criar o banco de dados "${DB_NAME}":`, error.message);
    throw error;
  } finally {
    await pgClient.end();
    console.log('Desconectado do servidor PostgreSQL (verificação/criação).');
  }
};

// Função para inicializar o Sequelize, definir modelos e sincronizar
const initializeDatabase = async () => {
  try {
    // 1. Garantir que o banco de dados físico exista
    await createDatabaseIfNotExists();

    // 2. Inicializar a instância do Sequelize agora que o DB_NAME existe
    sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false, // Log SQL em dev
    });

    // 3. Testar a conexão com o banco DB_NAME
    await sequelize.authenticate();
    console.log(`Conexão com o banco de dados "${DB_NAME}" estabelecida com sucesso via Sequelize.`);

    // 4. Definir modelos
    const User = sequelize.define('User', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, allowNull: false },
    }, { tableName: 'Users' });

    const Client = sequelize.define('Client', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      cpf_cnpj: { type: DataTypes.STRING, allowNull: false, unique: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      birthdate: { type: DataTypes.DATEONLY, allowNull: true },
      // UserId será adicionado pela associação
    }, { tableName: 'Clients' });

    // 5. Definir associações 1 para 1
    User.hasOne(Client, {
      foreignKey: { name: 'userId', allowNull: false, unique: true },
      onDelete: 'CASCADE',
    });
    Client.belongsTo(User, {
      foreignKey: { name: 'userId', allowNull: false },
    });

    // 6. Sincronizar modelos com o banco de dados
    // force: false -> não recria tabelas se já existirem
    // alter: true em desenvolvimento -> tenta aplicar alterações sem dropar
    await sequelize.sync({
      force: false, // IMPORTANTE: não apaga tabelas existentes
      alter: process.env.NODE_ENV === 'development', // Aplica alterações em dev
    });

    if (process.env.NODE_ENV === 'development') {
      console.log("Modelos sincronizados com o banco (alterações aplicadas se necessário em dev).");
    } else {
      console.log("Modelos sincronizados com o banco (tabelas criadas se não existiam).");
    }

    // Retornar a instância do sequelize e os modelos para serem usados em outras partes da aplicação
    return { sequelize, User, Client };

  } catch (error) {
    console.error('Falha ao inicializar o banco de dados e modelos:', error);
    throw error; // Relançar para que o server.js possa tratar
  }
};

// Exportar a função de inicialização e, potencialmente, a instância do sequelize
// e os modelos APÓS a inicialização (se necessário em outros módulos síncronos,
// mas é melhor pegar do retorno de initializeDatabase)
module.exports = { initializeDatabase };