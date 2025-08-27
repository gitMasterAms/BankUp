/**
 * models/Payments.js
 * * Define o schema da tabela 'Payments' usando o Sequelize.
 * * ATUALIZADO: O campo 'userId' foi removido, pois a referência ao usuário
 * * será feita através da tabela Recurring_Accounts.
 */
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    payment_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    // O campo userId foi removido daqui.
    account_id: { // Chave estrangeira para a tabela Recurring_Accounts
      type: DataTypes.UUID,
      allowNull: false
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    payment_method: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'PIX'
    },
    payment_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'concluído'
    },
    penalty_applied: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
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
    tableName: 'Payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Payment.associate = (models) => {
    // A associação com User foi removida daqui, pois não há mais chave direta.
    // A associação com RecurringAccount permanece.
    Payment.belongsTo(models.RecurringAccount, {
      foreignKey: 'account_id',
      onDelete: 'CASCADE'
    });
  };

  return Payment;
};
