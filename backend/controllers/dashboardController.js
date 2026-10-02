const User = require("../models/User");
const Order = require("../models/Order");
const Contact = require("../models/Contact");
const Review = require("../models/Review");
const MenuItem = require("../models/MenuItem");

const getDashboardStats = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalOrders = await Order.countDocuments();

        const totalReviews = await Review.countDocuments();

        const totalContacts = await Contact.countDocuments();

        const totalMenu = await MenuItem.countDocuments();

        const revenue = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$total"
                    }
                }
            }
        ]);

        res.json({

            success: true,

            totalUsers,

            totalOrders,

            totalReviews,

            totalContacts,

            totalMenu,

            totalRevenue:
                revenue.length > 0
                    ? revenue[0].total
                    : 0

        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const getOrderAnalytics = async (req, res) => {

    try {

        const monthlyOrders = await Order.aggregate([

            {
                $match: {
                    createdAt: {
                        $exists: true
                    }
                }
            },

            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    orders: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }

        ]);

        res.json({
            success: true,
            monthlyOrders
        });

    } catch (err) {

        console.error("Order Analytics Error:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    getDashboardStats,
    getOrderAnalytics
};