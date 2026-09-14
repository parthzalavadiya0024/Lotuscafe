const Order = require("../models/Order");

// Create Order
const createOrder = async (req, res) => {

    try {

        const {
            customerName,
            phone,
            orderType,
            tableNumber,
            deliveryAddress,
            items,
            subtotal,
            gst,
            deliveryCharge,
            discount,
            total,
            paymentMethod
        } = req.body;

        if (
            !customerName ||
            !phone ||
            !orderType ||
            !items ||
            items.length === 0 ||
            !paymentMethod
        ) {
            return res.status(400).json({
                success: false,
                message: "Please complete all required details."
            });
        }

        // Generate Order ID (LC-1001, LC-1002...)

const lastOrder = await Order.findOne().sort({ createdAt: -1 });

let nextNumber = 1001;

if (lastOrder && lastOrder.orderId) {
    nextNumber = parseInt(lastOrder.orderId.replace("LC-", "")) + 1;
}

const orderId = `LC-${nextNumber}`;

        const order = await Order.create({
            orderId,
            customerName,
            phone,
            orderType,
            tableNumber,
            deliveryAddress,
            items,
            subtotal,
            gst,
            deliveryCharge,
            discount,
            total,
            paymentMethod
        });

        res.status(201).json({
            success: true,
            message: "Order Placed Successfully",
            order
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Get All Orders (Admin)
const getOrders = async (req, res) => {

    try {

        const orders = await Order.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Update Order Status

const updateOrderStatus = async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        res.json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Get Orders By Phone

const getUserOrders = async (req, res) => {

    try {

        const { phone } = req.params;

        const orders = await Order.find({ phone })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Delete Order
const deleteOrder = async (req, res) => {

    console.log("DELETE API HIT", req.params.id);

    try {

        const { id } = req.params;

        const order = await Order.findByIdAndDelete(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    createOrder,
    getOrders,
    getUserOrders,
    updateOrderStatus,
    deleteOrder
};