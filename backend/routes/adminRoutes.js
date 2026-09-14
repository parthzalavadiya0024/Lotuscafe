const express = require("express");
const router = express.Router();

const {
    adminLogin,
    getAdminProfile,
    updateAdminProfile,
    changePassword,
    sendOTP,
    verifyOTP,
    resetPassword
} = require("../controllers/adminController");

router.post("/login", adminLogin);
router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);
router.put("/change-password", changePassword);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;