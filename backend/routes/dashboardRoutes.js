const express = require("express");
const router = express.Router();

const {
    getDashboardStats,
    getOrderAnalytics
} = require("../controllers/dashboardController");


router.get("/stats", getDashboardStats);

router.get("/order-analytics", getOrderAnalytics);


module.exports = router;