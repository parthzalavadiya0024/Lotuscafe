const express = require("express");
const router = express.Router();

const {
    sendMessage,
    getContacts,
    deleteContact
} = require("../controllers/contactController");

router.post("/send", sendMessage);

router.get("/all", getContacts);

router.delete("/:id", deleteContact);

module.exports = router;