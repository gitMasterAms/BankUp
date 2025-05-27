// server.js
require('dotenv').config();
const express = require('express');
const { sequelize, connectDB } = require('./config/db'); // sequelize é importado mas não usado diretamente para sync aqui
const userRoutes = require('./routes/userRoutes');
// Importar modelos para que o Sequelize os conheça, mas não necessariamente para sincronizá-los
require('./models/userModel');


const startServer = async () => {
  try {
    await connectDB(); // Apenas conecta e autentica no banco de dados

    // COMENTE OU REMOVA AS LINHAS DE sequelize.sync()
    // Se você criou as tabelas manualmente, não precisa que o Sequelize tente sincronizar.
    // O Sequelize irá apenas usar as tabelas existentes se os nomes e colunas corresponderem.

    /*
    if (process.env.NODE_ENV === 'development') {
       // await sequelize.sync({ alter: true }); // NÃO USE SE GERENCIA MANUALMENTE
       // await sequelize.sync({ force: true }); // NÃO USE SE GERENCIA MANUALMENTE
       // await sequelize.sync(); // Mesmo esta pode ser desabilitada
       console.log("Sincronização automática de modelos DESABILITADA. Tabelas gerenciadas manualmente ou via migrations.");
    }
    */

    const app = express();
    app.use(express.json());
    app.use('/api/users', userRoutes);

    // Middleware de tratamento de erros global
    app.use((err, req, res, next) => {
      console.error("ERRO GLOBAL:", err.name, err.message, err.stack);
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Ocorreu um erro interno no servidor.';
      res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

  } catch (error) {
    console.error("Falha ao iniciar o servidor:", error);
    process.exit(1);
  }
};

startServer();