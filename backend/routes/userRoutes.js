const express = require("express");

const router = express.Router();

const {
    getUsers,
    deleteUser
} = require("../controllers/userController");

// Get All Customers
router.get("/", getUsers);

// Delete Customer
router.delete("/:id", deleteUser);

module.exports = router;