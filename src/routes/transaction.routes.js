const transactionController = require("../controllers/transaction.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const express = require("express");
const router = express.Router();

router.post("/", authMiddleware, transactionController.createTransaction);
module.exports = router;
