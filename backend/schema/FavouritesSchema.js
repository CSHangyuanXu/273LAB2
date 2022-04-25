const mongoose = require("mongoose");

const FavouritesSchema = mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  by: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("favourites", FavouritesSchema);
