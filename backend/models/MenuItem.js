const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    smallPrice: {
    type: Number,
    default: 0
},

mediumPrice: {
    type: Number,
    default: 0
},

largePrice: {
    type: Number,
    default: 0
},

onePcPrice: {
    type: Number,
    default: 0
},

twoPcPrice: {
    type: Number,
    default: 0
},

fourPcPrice: {
    type: Number,
    default: 0
},

eightPcPrice: {
    type: Number,
    default: 0
},

twelvePcPrice: {
    type: Number,
    default: 0
},
    
    description: {
        type: String
    },
    image: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("MenuItem", menuItemSchema);