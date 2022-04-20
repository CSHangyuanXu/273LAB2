const mongoose = require("mongoose");

const PurchaseSchema = mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  by: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("purchase", PurchaseSchema);
