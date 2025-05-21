const express = require('express');
const router = express.Router();
const {myBookings, addBookings, allBookings, bookingsById} = require('../controllers/bookingController')

router.get("/mybookings/:userId", myBookings);
router.get("/allBookings", allBookings);
router.get("/getBookingById/:bookingId", bookingsById);
router.post("/addBooking", addBookings);

module.exports = router;