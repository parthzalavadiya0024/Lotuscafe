const Contact = require("../models/Contact");

const sendMessage = async (req, res) => {

    try {

        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            message
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            contact
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Get All Contacts
const getContacts = async (req, res) => {

    try {

        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            contacts
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


// Delete Contact
const deleteContact = async (req, res) => {

    try {

        await Contact.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Contact Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    sendMessage,
    getContacts,
    deleteContact
};