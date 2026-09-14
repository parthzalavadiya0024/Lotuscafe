require("dotenv").config();
const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem");

mongoose
  .connect("mongodb://127.0.0.1:27017/lotus_cafe_restro")
  .then(async () => {
    console.log("✅ MongoDB Connected");

    await MenuItem.deleteMany({});

    const menuItems = [
      // Coffee
      { name: "Latte", category: "Coffee", price: 120, image: "latte.jpeg", available: true },
      { name: "Cappuccino", category: "Coffee", price: 120, image: "cappuccino.jpeg", available: true },
      { name: "Espresso", category: "Coffee", price: 120, image: "Espresso.jpg", available: true },
      { name: "Americano", category: "Coffee", price: 140, image: "Americano.jpg", available: true },
      { name: "Mocha", category: "Coffee", price: 180, image: "mocha.jpg", available: true },
      { name: "Cold Coffee", category: "Coffee", price: 120, image: "cold coffee.jpg", available: true },

      // Desserts
      { name: "Cheese Cake", category: "Dessert", price: 120, image: "cake.jpeg", available: true },
      { name: "Brownie", category: "Dessert", price: 120, image: "brownie.jpg", available: true },
      { name: "Chocolate Pastry", category: "Dessert", price: 140, image: "chocolate pastry.jpg", available: true },
      { name: "Red Velvet Cake", category: "Dessert", price: 220, image: "Red velvet cake.jpg", available: true },
      { name: "Ice Cream Sundae", category: "Dessert", price: 180, image: "Ice Cream Sundae.jpg", available: true },

      // Pizza
      { name: "Farmhouse", category: "Pizza", price: 199, image: "pizza.jpeg", available: true },
      { name: "Margherita", category: "Pizza", price: 159, image: "Margherita.jpg", available: true },
      { name: "Paneer Tikka Masala", category: "Pizza", price: 299, image: "panner tikka masala.jpg", available: true },
      { name: "Cheese Burst", category: "Pizza", price: 399, image: "Cheese Burst.jpg", available: true },
      { name: "Mexican Green Wave", category: "Pizza", price: 299, image: "Mexican Green Wave.jpg", available: true },

      // Snacks
      { name: "Veg Sandwich", category: "Snacks", price: 120, image: "Veg sandwich.jpeg", available: true },
      { name: "Cheese Sandwich", category: "Snacks", price: 140, image: "Cheese Sandwich.jpg", available: true },
      { name: "Grilled Sandwich", category: "Snacks", price: 160, image: "Grilled Sandwich.jpg", available: true },
      { name: "Corn Cheese Sandwich", category: "Snacks", price: 150, image: "Corn Cheese Sandwich.jpg", available: true },
      { name: "Paneer Sandwich", category: "Snacks", price: 180, image: "Paneer Sandwich.jpg", available: true },
      { name: "Garlic Bread", category: "Snacks", price: 120, image: "garlicbread.jpeg", available: true },
      { name: "Cheese Garlic Bread", category: "Snacks", price: 180, image: "cheese garlic bread.jpg", available: true },
      { name: "Nachos", category: "Snacks", price: 140, image: "nachoas.jpg", available: true },
      { name: "French Fries", category: "Snacks", price: 120, image: "french fries.jpg", available: true },
      { name: "Burger", category: "Snacks", price: 100, image: "burger.jpg", available: true },
      { name: "Cheese Burger", category: "Snacks", price: 120, image: "cheese burger.jpg", available: true }
    ];

    await MenuItem.insertMany(menuItems);

    console.log(`✅ ${menuItems.length} Menu Items Inserted Successfully`);

    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });