const { where } = require('sequelize');
const { Booking } = require('../models');

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

const addBookings = async (req, res) => {
    const {booking_location, booking_time, booking_date, category, service_type, userId} = req.body;

    if (!booking_date || !booking_location || !booking_time || !category || !service_type || !userId) {
        res.status(400).json({ error: 'All fields are required.' });
    };

    try {
        const newBooking = await Booking.create({
            booking_date,
            booking_location,
            booking_time,
            category,
            service_type,
            userId
        });

        return res.status(201).json({
            success: true,
            message: 'Booking created Successfully',
            booking: {
                booking_id: newBooking.id,
                booking_status: newBooking.booking_status,
                booking_date: newBooking.booking_date,
                booking_location: newBooking.booking_location,
                booking_time:  newBooking.booking_time,
                category: newBooking.category,
                service_type: newBooking.service_type,
                userId: newBooking.userId
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
}

module.exports = { myBookings, addBookings, allBookings, bookingsById };