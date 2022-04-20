const mongoose = require("mongoose");

const ShopSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  sales: {
    type: Number,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model("shop", ShopSchema);
