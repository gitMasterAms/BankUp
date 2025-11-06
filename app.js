require('dotenv').config();
const express = require('express');
const { initializeDatabase } = require('./config/database');
const { startDailyJob } = require('./config/dailyOverdueCheck');
const { initializeClient } = require('./utils/WhatsappClient');

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

    await initializeClient();

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