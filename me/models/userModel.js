// userModel.js (ou o nome que você deu ao arquivo)

const { DataTypes } = require('sequelize');
// Assumindo que database.js está na raiz do projeto e este arquivo está em uma pasta 'models'
// Se database.js estiver em './config/database.js' relativo a ESTE arquivo, o caminho seria './config/database'
// Se database.js estiver na MESMA pasta que este arquivo, seria './database'
const { sequelize } = require('../config/database'); // <<< VERIFIQUE ESTE CAMINHO CUIDADOSAMENTE

// Convenção: Nome do modelo no singular (User)
// Sequelize automaticamente pluraliza para o nome da tabela (Users), a menos que você especifique tableName
const Users = sequelize.define('User', {
    // Opcional: Definir ID explicitamente, embora Sequelize adicione por padrão
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING, // Correto: Usar DataTypes.STRING
        allowNull: false,       // Boa prática: email geralmente é obrigatório
        unique: true,           // Boa prática: email geralmente é único
        validate: {
            isEmail: true,      // Boa prática: validação de formato de email
        }
    },
    password: {
        type: DataTypes.STRING, // Correto: Usar DataTypes.STRING
        allowNull: false,       // Boa prática: senha geralmente é obrigatória
    }
    // Timestamps (createdAt, updatedAt) são adicionados por padrão pelo Sequelize.
    // Se não os quiser, adicione nas opções do modelo: { timestamps: false }
}, {
    // Opções do modelo (opcional)
    tableName: 'Users', // Define explicitamente o nome da tabela, se necessário
    // timestamps: true // Já é o padrão
});

module.exports = Users; // Correto: Exportar a variável que contém o modelo