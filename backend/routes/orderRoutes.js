const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    getUserOrders,
    updateOrderStatus,
    deleteOrder
} = require("../controllers/orderController");

router.post("/place", createOrder);
router.get("/all", getOrders);
router.get("/user/:phone", getUserOrders);
router.put("/status/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;