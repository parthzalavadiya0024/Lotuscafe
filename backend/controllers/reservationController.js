const Reservation = require("../models/Reservation");

// Create Reservation
const createReservation = async (req, res) => {

    try {

        const {
            customerName,
            phone,
            tableNumber,
            reservationDate,
            reservationTime,
            guests
        } = req.body;

        if (
            !customerName ||
            !phone ||
            !tableNumber ||
            !reservationDate ||
            !reservationTime ||
            !guests
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        const reservation = await Reservation.create({
            customerName,
            phone,
            tableNumber,
            reservationDate,
            reservationTime,
            guests
        });

        res.status(201).json({
            success: true,
            message: "Table Reserved Successfully",
            reservation
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Get All Reservations
const getReservations = async (req, res) => {

    try {

        const reservations = await Reservation.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reservations
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    createReservation,
    getReservations
};