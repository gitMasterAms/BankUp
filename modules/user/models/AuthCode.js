module.exports = (sequelize, DataTypes) => {
  const AuthCode = sequelize.define('AuthCode', {
    id: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    }, 
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('login_verification', 'password_reset'),
      allowNull: false,
    },
    twoFactorCode: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },   
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  }, {
    tableName: 'AuthCodes',
    indexes: [
      { fields: ['userId'] },
      { unique: true, fields: ['userId', 'type'] } // evita múltiplos códigos ativos por tipo
    ]
  });

  AuthCode.associate = (models) => {
    AuthCode.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        onDelete: 'CASCADE',
      },
    });
  };

  return AuthCode;
};
