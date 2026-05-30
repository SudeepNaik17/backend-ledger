const mongoose = require("mongoose");
const ledgerSchema = mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Ledger must be associated with the account"],
      index: true,
      immutable: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required to create a ledger"],
      immutable: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
      required: [true, "ledger must be associated with the transaction"],
      index: true,
      immutable: true,
    },
    type: {
      type: String,
      enum: {
        values: ["CREDIT", "DEBIT"],
        message: "type must be credit or debit",
      },
      default: "DEBIT",
      immutable: true,
    },
  },
  {
    timestamps: true,
  },
);

const preventUpdate = () => {
  throw new Error("The ledger cannnot be modified or deleted");
};
ledgerSchema.pre("findOneAndUpdate", preventUpdate);
ledgerSchema.pre("updateOne", preventUpdate);
ledgerSchema.pre("deleteOne", preventUpdate);
ledgerSchema.pre("deleteMany", preventUpdate);
ledgerSchema.pre("updateMany", preventUpdate);
ledgerSchema.pre("remove", preventUpdate);

const ledgerModel = mongoose.model("ledger", ledgerSchema);
module.exports = ledgerModel;
