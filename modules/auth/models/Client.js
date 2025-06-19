module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    userId: { //possivelmente já seria adicionado pelo associate, mas por conta do UUID é bom definir.
      type: DataTypes.UUID, // ← Importante: precisa ser UUID
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf_cnpj: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    
  }, {
    tableName: 'Clients',
  });

  Client.associate = (models) => {
    Client.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        onDelete: 'CASCADE',        
      },
       // opcional, se quiser deletar o Client quando o User for apagado
    });
  };

  return Client;
};
