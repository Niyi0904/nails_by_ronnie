module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID, 
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      total_price: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
    }, {
      tableName: 'CartItem',
      underscored: true
    });

    CartItem.associate = (models) => {
      CartItem.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    };

    CartItem.beforeCreate((item) => {
        item.total_price = item.price * item.quantity;
      });
    
    CartItem.beforeUpdate((item) => {
    item.total_price = item.price * item.quantity;
    });
  
    return CartItem;
  };
  