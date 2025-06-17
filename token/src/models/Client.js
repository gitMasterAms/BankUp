module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('Client', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      userId: { //possivelmente já seria adicionado pelo associate, mas por conta do UUID é bom definir.
        type: DataTypes.UUID, // ← Importante: precisa ser UUID
        allowNull: false,
        unique: true,
      },
    }, {
      tableName: 'Clients',
    });
  
    Client.associate = (models) => {
      Client.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        onDelete: 'CASCADE', // opcional, se quiser deletar o Client quando o User for apagado
      });
    };
  
    return Client;
  };