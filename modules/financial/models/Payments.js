module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    payment_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    account_id: { // Chave estrangeira para a tabela Recurring_Accounts
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
    // Multa fixa por atraso
    fine_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    // Juros mensal (%)
    interest_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    // Valor final calculado (opcional)
    final_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    // Data real de pagamento (opcional)
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

  Payment.associate = (models) => {
    Payment.belongsTo(models.RecurringAccount, {
      foreignKey: 'account_id',
      onDelete: 'CASCADE'
    });
  };

  return Payment;
};
