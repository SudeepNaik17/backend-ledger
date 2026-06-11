const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  createAccountController,
  getUserAccountsController,
  getAccountBalanceController,
} = require("../controllers/account.controller");
const accountRouter = express.Router();

/*
 *- POST /api/accounts
 *- create a new account
 *- protected route
 */
accountRouter.post("/", authMiddleware, createAccountController);

/**
 *- GET /api/accounts
 *- get all accounts of logined user
 *- Protected route
 */
accountRouter.get("/", authMiddleware, getUserAccountsController);

accountRouter.get(
  "/balance/:accountId",
  authMiddleware,
  getAccountBalanceController,
);
module.exports = accountRouter;
