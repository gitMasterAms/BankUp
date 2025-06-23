// models/userModel.js
const { DataTypes, UUIDV4 } = require('sequelize'); // Importando UUIDV4  para o ID único
                                            

module.exports = (sequelizeInstance, DataTypes) => { // sequelizeInstance é o 'sequelize' passado
  const User = sequelizeInstance.define('User', {
    id: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, // Gera um UUID v4 automaticamente
      allowNull: false,
      primaryKey: true,
      // autoIncrement: false, // << REMOVA OU DEFINA COMO FALSE: UUIDs não são auto-incrementais
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  }, {
    tableName: 'Users',
  });

  User.associate = (models) => {
    User.hasOne(models.Client, {
      foreignKey: {
        name: 'userId', // Este userId no Client ainda será um UUID
        allowNull: false,
        unique: true,
      },
      onDelete: 'CASCADE',
    });
  };

  return User;
};