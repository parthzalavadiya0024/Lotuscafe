const MenuItem = require("../models/MenuItem");

// Add Menu Item
const addMenuItem = async (req, res) => {
    try {

        const menuData = {
            ...req.body
        };

        if (req.file) {
            menuData.image = req.file.filename;
        }

        const menuItem = await MenuItem.create(menuData);

        res.status(201).json({
            success: true,
            message: "Menu Item Added Successfully",
            menuItem
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Menu Items
const getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find();

        res.status(200).json({
            success: true,
            menuItems
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Single Menu Item
const getMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu Item Not Found"
            });
        }

        res.status(200).json({
            success: true,
            menuItem
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Menu Item
const updateMenuItem = async (req, res) => {
    try {

        const updateData = {
            ...req.body
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: "Menu Item Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Menu Item Updated Successfully",
            menuItem: updatedItem
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Menu Item
const deleteMenuItem = async (req, res) => {
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: "Menu Item Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Menu Item Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addMenuItem,
    getMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem
};