const express = require("express");
const authRouter = express.Router();
const {
  userRegisterController,
  userLoginController,
  userLogoutController,
} = require("../controllers/auth.controllers");

authRouter.post("/register", userRegisterController);

authRouter.post("/login", userLoginController);

authRouter.get("/logout", userLogoutController);
module.exports = authRouter;
