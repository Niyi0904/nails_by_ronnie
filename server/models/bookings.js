module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      service_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      booking_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      booking_time: {
        type: DataTypes.TIME,
        allowNull: false
      },
      booking_status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      booking_location: {
        type: DataTypes.STRING,
        allowNull: false
      }
      // Other booking-specific fields
    }, {
      tableName: 'Bookings',
      underscored: true
    });
  
    return Booking;
  };
  