const {
  authMiddleware,
  authSystemUserMiddleware,
} = require("../middleware/auth.middleware");
const {
  createTransaction,
  createInitialFundsTransaction,
} = require("../controllers/transaction.controller");
const express = require("express");
const transactionRouter = express.Router();

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */
transactionRouter.post("/", authMiddleware, createTransaction);

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
transactionRouter.post(
  "/system/initial-funds",
  authSystemUserMiddleware,
  createInitialFundsTransaction,
);
module.exports = transactionRouter;
