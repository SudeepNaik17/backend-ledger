const express = require("express");
const router = express.Router();
const { userRegisterController } = require("../controllers/auth.controllers");

router.post("/register", userRegisterController);

module.exports = router;
