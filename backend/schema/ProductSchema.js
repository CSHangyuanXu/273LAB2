const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: false,
  },
  shopId: {
    type: String,
    required: true,
  },
  sales: {
    type: Number,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model("product", ProductSchema);
