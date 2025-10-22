module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    payment_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: { // 🔗 FK para o usuário que criou o pagamento
      type: DataTypes.UUID,
      allowNull: false
    },
    account_id: { // FK para a conta recorrente
      type: DataTypes.UUID,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pendente', 'concluido', 'vencido'),
      allowNull: false,
      defaultValue: 'pendente'
    },
    fine_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    interest_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    final_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pix_key: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  }, {
    tableName: 'Payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // 🔗 Associações
  Payment.associate = (models) => {
    // Pagamento pertence a uma conta recorrente
    Payment.belongsTo(models.RecurringAccount, {
      foreignKey: 'account_id',
      onDelete: 'CASCADE'
    });

    Payment.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return Payment;
};
