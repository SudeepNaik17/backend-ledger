const { authMiddleware } = require("../middlewares/auth.middleware");
const { createTransaction } = require("../controllers/transaction.controller");
const express = require("express");
const router = express.Router();

router.post("/", authMiddleware, createTransaction);
module.exports = router;
