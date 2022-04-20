const mongoose = require("mongoose");

const UsersScheme = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },

  address: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },

  about: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  isSeller: {
    type: Boolean,
    required: false,
    default: false,
  },
});

module.exports = mongoose.model("users", UsersScheme);
