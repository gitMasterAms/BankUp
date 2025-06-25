module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
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
    tableName: 'Profiles',
  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        onDelete: 'CASCADE',        
      },
       // opcional, se quiser deletar o Profile quando o User for apagado
    });
  };

  return Profile;
};
