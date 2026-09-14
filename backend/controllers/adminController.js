const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../config/mailer");

let otpStore = {};

const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const match = await bcrypt.compare(password, admin.password);

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            { id: admin._id },
            "lotuscafe_admin_secret",
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Get Admin Profile
const getAdminProfile = async (req, res) => {

    try {

        const admin = await Admin.findOne().select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.json({
            success: true,
            admin
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Update Admin Profile
const updateAdminProfile = async (req, res) => {

    try {

        const { name, phone, email } = req.body;

        const admin = await Admin.findOne();

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        admin.name = name;
        admin.phone = phone;
        admin.email = email;

        await admin.save();

        res.json({
            success: true,
            message: "Profile Updated Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Change Password
const changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const admin = await Admin.findOne();

        if (!admin) {

            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });

        }

        const match = await bcrypt.compare(currentPassword, admin.password);

        if (!match) {

            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });

        }

        admin.password = await bcrypt.hash(newPassword, 10);

        await admin.save();

        res.json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const sendOTP = async (req, res) => {

    try {

        const { email } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.json({
                success: false,
                message: "Email not found"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore[email] = {
            otp,
            expires: Date.now() + 5 * 60 * 1000
        };

        await sendMail(
            email,
            "LotusCafe Admin Password Reset",
            `
                <h2>LotusCafe Admin OTP</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP is valid for 5 minutes.</p>
            `
        );

        res.json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Unable to send OTP"
        });

    }

};

const verifyOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;

        if (!otpStore[email]) {
            return res.json({
                success: false,
                message: "OTP not found"
            });
        }

        if (Date.now() > otpStore[email].expires) {

            delete otpStore[email];

            return res.json({
                success: false,
                message: "OTP Expired"
            });

        }

        if (otpStore[email].otp !== otp) {

            return res.json({
                success: false,
                message: "Invalid OTP"
            });

        }

        res.json({
            success: true,
            message: "OTP Verified"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

const resetPassword = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!otpStore[email]) {
            return res.json({
                success: false,
                message: "Please verify OTP first"
            });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.json({
                success: false,
                message: "Admin not found"
            });
        }

        admin.password = await bcrypt.hash(password, 10);

        await admin.save();

        delete otpStore[email];

        res.json({
            success: true,
            message: "Password Reset Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

module.exports = {
    adminLogin,
    getAdminProfile,
    updateAdminProfile,
    changePassword,
    sendOTP,
    verifyOTP,
    resetPassword
};