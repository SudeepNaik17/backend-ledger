const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const transactionModel = require("../models/transaction.model");
const userModel = require("../models/user.model");
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
    return res.status(400).json({
      message: " fromUserAccount and toUserAccount is required",
    });
  }

  /*
   *- 2.Validate idempotence key
   */
  const isTransactionAlreadyExists = await transactionModel.findOne({
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
    return res.status(400).json({
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
  let transaction;
  try {
    /**
     * 5. Create transaction (PENDING)
     */

    const session = await mongoose.startSession();
    session.startTransaction();

    transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            status: "PENDING",
            amount,
            idempotencyKey,
          },
        ],
        { session },
      )
    )[0];

    /**
     *  6.Create DEBIT ledger entry
     */

    const debitLedgerAmount = await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
    })();

    /**
     *  7.Create CREDIT ledger entry
     */

    const creditLedgerAmount = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    /**
     * 8.Mark transaction COMPLETED
     */
    await transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session },
    );
    // await transaction.save({ session });

    /**
     * 9.Commit MongoDB session
     */
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    return res.status(400).json({
      message:
        "Transaction is PENDING due to some error,try again after some time",
    });
  }

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

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount,amount and idempotencyKey are required",
    });
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid Account!",
    });
  }
  const systemUserObjectId = new mongoose.Types.ObjectId(req.user._id);
  const fromUserAccount = await accountModel.findOne({
    user: systemUserObjectId,
  });
  console.log(fromUserAccount);

  if (!fromUserAccount) {
    return res.status(400).json({
      message: "invalid system account!",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    status: "PENDING",
    amount,
    idempotencyKey,
  });
  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );
  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();
  return res.status(201).json({
    message: "Initial fund transaction completed sucessfully!",
    transaction,
  });
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};
