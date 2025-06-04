const { where } = require('sequelize');
const { Booking, User } = require('../models');

const myBookings = async (req, res) => {
    const user_id = req.params.userId;

    try {
        const allBookings = await Booking.findAll({
            attributes: { exclude: ['user_id'] },
            where: { user_id }
        })

        return res.status(201).json({
            message: 'completed', allBookings
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
}

const allBookings = async (req, res) => {
    try {
        const allBookings = await Booking.findAll();

        return res.status(201).json({
            message: 'completed', allBookings
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
}

const bookingsById = async (req, res) => {
    const booking_id = req.params.bookingId;

    try {
        const bookingDetails = await Booking.findOne({
            where: { booking_id }
        })

        return res.status(201).json({
            message: 'completed', bookingDetails
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
}

const updateBooking = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await booking.update({ booking_status: status });

    res.json({ success: true, message: "Status updated", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
};

const addBookings = async (req, res) => {
    const {booking_location, booking_time, name, phone, booking_date, sub_category, service_type, email, additional_notes} = req.body;

    if (!booking_date || !booking_location || !name || !phone || !booking_time || !sub_category || !service_type) {
        res.status(400).json({ error: 'All fields are required.' });
    };

    try {
        const user = await  User.findOne({where: {email}});

        const newBooking = await Booking.create({
            booking_date,
            booking_location,
            booking_time,
            name,
            phone,
            additional_notes,
            sub_category,
            service_type,
            email: email,
            userId: user ?  user.Userid : null
        });

        return res.status(201).json({
            success: true,
            message: 'Booking created Successfully',
            newBooking
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
}

module.exports = { myBookings, addBookings, allBookings, bookingsById, updateBooking };