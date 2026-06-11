const express = require("express");
const authRouter = express.Router();
const {
  userRegisterController,
  userLoginController,
} = require("../controllers/auth.controllers");

authRouter.post("/register", userRegisterController);

authRouter.post("/login", userLoginController);

module.exports = authRouter;
