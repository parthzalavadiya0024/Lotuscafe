const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    orderId: {
    type: String,
    unique: true,
    required: true
    }, 
    
    customerName: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true
    },

    orderType: {
        type: String,
        enum: ["Dine In", "Take Away", "Delivery"],
        required: true
    },

    tableNumber: {
        type: String,
        default: null
    },

    deliveryAddress: {
        type: String,
        default: ""
    },

    items: [
        {
            name: String,
            size: String,
            quantity: Number,
            price: Number
        }
    ],

    subtotal: {
        type: Number,
        required: true
    },

    gst: {
        type: Number,
        required: true
    },

    deliveryCharge: {
        type: Number,
        required: true
    },

    discount: {
        type: Number,
        default: 0
    },

    total: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["Cash", "UPI", "Card"],
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);