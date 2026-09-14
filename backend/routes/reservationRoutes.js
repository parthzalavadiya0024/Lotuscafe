const express = require("express");
const router = express.Router();

const {
    createReservation,
    getReservations
} = require("../controllers/reservationController");

router.post("/add", createReservation);
router.get("/all", getReservations);

module.exports = router;