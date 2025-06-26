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
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    payee: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pix_key: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
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
