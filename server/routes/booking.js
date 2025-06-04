const express = require('express');
const router = express.Router();
const {myBookings, addBookings, allBookings, bookingsById, updateBooking} = require('../controllers/bookingController')

router.get("/mybookings/:userId", myBookings);
router.get("/allBookings", allBookings);
router.get("/getBookingById/:bookingId", bookingsById);
router.patch("/:bookingId/status", updateBooking);
router.post("/addBooking", addBookings);

module.exports = router;