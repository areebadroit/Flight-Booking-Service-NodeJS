const express = require("express");

const infoRoutes = require("./info-router");
const bookingRoutes = require("./booking-routes");
const router = express.Router();
router.use("/info", infoRoutes);
router.use("/bookings", bookingRoutes);
module.exports = router;
