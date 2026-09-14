require("dotenv").config();

const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
const connectDB = require("./config/db");

connectDB();

async function createAdmin() {
    try {

        const adminExists = await Admin.findOne({
            email: "admin@lotuscafe.com"
        });

        if (adminExists) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        await Admin.create({
            email: "admin@lotuscafe.com",
            password: hashedPassword
        });

        console.log("✅ Admin Created Successfully");
        process.exit();

    } catch (err) {

        console.log(err);
        process.exit();

    }
}

createAdmin();