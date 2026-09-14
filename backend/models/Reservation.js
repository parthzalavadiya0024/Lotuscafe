const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({

    customerName: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true
    },

    tableNumber: {
        type: String,
        required: true
    },

    reservationDate: {
        type: String,
        required: true
    },

    reservationTime: {
        type: String,
        required: true
    },

    guests: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Reservation", reservationSchema);