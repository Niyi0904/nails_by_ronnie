module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      service_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sub_category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      booking_date: {
        type: DataTypes.STRING,
        allowNull: false
      },
      booking_time: {
        type: DataTypes.STRING,
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
      },
      additional_notes: {
        type: DataTypes.STRING,
        allowNull: true
      }
      // Other booking-specific fields
    }, {
      tableName: 'Bookings',
      underscored: true
    });
  
    return Booking;
  };
  