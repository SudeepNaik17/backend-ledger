const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const transactionModel = require("../models/transaction.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");
/**
 * Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 */

const createTransaction = async (req, res) => {
  /*
   * 1.Validation
   */
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount,toAccount,amount and idempotencyKey is required",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });
  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount && !toUserAccount) {
    return res.staus(400).json({
      message: " fromUserAccount and toUserAccount is required",
    });
  }

  /*
   *- 2.Validate idempotence key
   */
  const isTransactionAlreadyExists = await accountModel.findOne({
    idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status == "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already processed!",
        transaction: isTransactionAlreadyExists,
      });
    }
    if (isTransactionAlreadyExists.status == "PENDING") {
      return res.status(200).json({
        message: "Transaction is processing!",
      });
    }
    if (isTransactionAlreadyExists.status == "FAILED") {
      return res.status(500).json({
        message: "Transaction processing failed,please retry!",
      });
    }
    if (isTransactionAlreadyExists.status == "REVERSED") {
      return res.status(500).json({
        message: "transaction was reversed, please retry",
      });
    }
  }
  /*
    3. Check account status
    */

  if (fromUserAccount.status != "ACTIVE" || toUserAccount.status != "ACTIVE") {
    res.status(400).json({
      message: "for transaction both fromAccount toAccount should be active",
    });
  }

  /**
   * 4.Derive sender balance from ledger
   */
  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient Balance!, current balance is ${balance} and requested amount is ${amount}`,
    });
  }

  /**
   * 5. Create transaction (PENDING)
   */

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = await transactionModel.create(
    {
      fromAccount,
      toAccount,
      status: "PENDING",
      amount,
      idempotencyKey,
    },
    { session },
  );

  /**
   *  6.Create DEBIT ledger entry
   */

  const debitLedgerAmount = await ledgerModel.create(
    {
      account: fromAccount,
      amount,
      transaction: transaction._id,
      type: "DEBIT",
    },
    { session },
  );

  /**
   *  7.Create CREDIT ledger entry
   */

  const creditLedgerAmount = await ledgerModel.create(
    {
      account: toAccount,
      amount,
      transaction: transaction._id,
      type: "CREDIT",
    },
    { session },
  );

  /**
   * 8.Mark transaction COMPLETED
   */
  transaction.status = "COMPLETED";
  await transaction.save({ session });

  /**
   * 9.Commit MongoDB session
   */
  await session.commitTransaction();
  session.endSession();

  /**
   * 10. Send email notification
   */
  await emailService.sendTransactionEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount,
  );
  res.status(201).json({
    message: "Transaction completed!",
    transaction,
  });
};

module.exports = {
  createTransaction,
};
