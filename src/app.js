const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

/*
 *- Middlewares
 */
app.use(express.json());
app.use(cookieParser());

/*
 *- Routes required
 */
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRouter = require("./routes/transaction.routes");

/*
 *- use routes
 */
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);

app.get("/", (req, res) => {
  res.send("Ledger service is up and running!");
});
module.exports = app;
