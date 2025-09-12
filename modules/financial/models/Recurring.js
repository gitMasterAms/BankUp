module.exports = (sequelize, DataTypes) => {
  const RecurringAccount = sequelize.define('RecurringAccount', {
    account_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4 // ← isso aqui gera o UUID automaticamente
    },
    userId: { // Referência direta ao User, como está em Client
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cpf_cnpj: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
  }, {
    tableName: 'Recurring_Accounts',
    //timestamps: false 
  });

  // Associação com o modelo User (de auth/models/User.js)
  RecurringAccount.associate = (models) => {
    RecurringAccount.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return RecurringAccount;
};
