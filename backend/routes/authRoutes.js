const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile,
    changePassword,
    sendOTP,
    verifyOTP,
    resetPassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getCurrentUser);
router.put("/update-profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;