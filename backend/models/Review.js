const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },

    rating:{
        type:Number,
        required:true
    },

    review:{
        type:String,
        required:true,
        trim:true
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Review",reviewSchema);