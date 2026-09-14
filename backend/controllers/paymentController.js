const razorpay = require("../config/razorpay");

// Create Razorpay Test Order
const createRazorpayOrder = async (req, res) => {
    try {

        const { amount } = req.body;

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment amount"
            });
        }

        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: "lotus_" + Date.now(),
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        console.error("Razorpay Create Order Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const crypto = require("crypto");

const verifyRazorpayPayment = async (req, res) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification details are missing."
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Payment verification failed."
            });

        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully."
        });

    } catch (error) {

        console.error(
            "Razorpay Payment Verification Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Payment verification failed."
        });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment
};