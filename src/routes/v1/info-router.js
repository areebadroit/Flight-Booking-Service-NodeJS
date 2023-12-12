const express = require("express");
const { InfoController } = require("../../controllers");
const router = express.Router();

router.get("/", InfoController.getInfo);

module.exports = router;
