const Review = require("../models/Review");

// Add Review
const addReview = async (req, res) => {

    try {

        const { name, rating, review } = req.body;

        if (!name || !rating || !review) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        const newReview = await Review.create({
            name,
            rating,
            review
        });

        res.status(201).json({
            success: true,
            message: "Review Submitted Successfully",
            review: newReview
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Get All Reviews
const getReviews = async (req, res) => {

    try {

        const reviews = await Review.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reviews
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Delete Review
const deleteReview = async (req, res) => {

    try {

        await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Review Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    addReview,
    getReviews,
    deleteReview
};