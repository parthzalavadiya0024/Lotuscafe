const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../config/mailer");

let otpStore = {};

const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        // Check if all fields are filled
        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            phone
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            success: true,
            message: "User Registered Successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            });
        }

        // Create JWT Token
        const token = jwt.sign(
            { id: user._id },
            "lotuscafe_secret_key",
            { expiresIn: "7d" }
        );

        res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
    }
});

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCurrentUser = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const updateProfile = async (req, res) => {

    try {

        const { fullName, email, phone } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.fullName = fullName;
        user.email = email;
        user.phone = phone;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password Updated Successfully"
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

        const user = await User.findOne({ email });

        if (!user) {
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
            "LotusCafe Password Reset",
            `
            <h2>Lotus Cafe</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>This OTP is valid for 5 minutes.</p>
            `
        );

        res.json({
            success: true,
            message: "OTP Sent Successfully"
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

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        user.password = await bcrypt.hash(password, 10);

        await user.save();

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
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile,
    changePassword,
    sendOTP,
    verifyOTP,
    resetPassword
};
