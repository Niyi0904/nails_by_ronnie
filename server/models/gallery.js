module.exports = (sequelize, DataTypes) => {
    const Gallery = sequelize.define('Gallery', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
    }, {
      tableName: 'Gallery',
      underscored: true
    });
  
    return Gallery;
  };
  