// app.js
require('dotenv').config();
const express = require('express');
const { initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

let db; // será preenchido por initializeDatabase()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startApp() {
  try {
    console.log('Inicializando o banco de dados...');
    db = await initializeDatabase();
    console.log('Banco de dados inicializado com sucesso.');

    // AQUI: use require('./routes')(db) em vez de app.use(routes)
    const createRoutes = require('./routes'); // rota exporta uma função (db) => router
    const cors = require('cors');
    app.use(cors());
    app.use(createRoutes(db));
    

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startApp();
