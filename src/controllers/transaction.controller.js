const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");

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
};
