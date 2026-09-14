const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
    addMenuItem,
    getMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem
} = require("../controllers/menuController");

// Add Menu
router.post("/add", upload.single("image"), addMenuItem);

// Get All Menu
router.get("/", getMenuItems);

// Get Single Menu
router.get("/:id", getMenuItemById);

// Update Menu
router.put("/:id", upload.single("image"), updateMenuItem);

// Delete Menu
router.delete("/:id", deleteMenuItem);

module.exports = router;