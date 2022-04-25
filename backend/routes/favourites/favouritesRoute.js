const express = require("express");
const router = express.Router();
const FavouritesSchema = require("../../schema/FavouritesSchema");
const ProductSchema = require("../../schema/ProductSchema");
const isLogin = require("../../helper/IsLogin");

// route to add an product to favourites
router.post("/add", isLogin, (req, res) => {
  const { productId } = req.body;
  console.log(req.body);
  const by = req.user._id;
  // make sure the not adding the same product twice to the favourites list of the same user
  FavouritesSchema.findOne({ productId, by })
    .then((favourites) => {
      if (favourites) {
        res.json({
          isSuccess: false,
          message: "You already added this product to your favourites",
        });
      } else {
        const newFavourites = new FavouritesSchema({
          productId,
          by,
        });
        newFavourites
          .save()
          .then(() => {
            res.json({
              isSuccess: true,
              message: "Product added to your favourites",
            });
          })
          .catch((err) => {
            res.json({
              isSuccess: false,
              message: "Error adding product to favourites",
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      res.json({
        isSuccess: false,
        message: "Error adding product to favourites",
        error: err,
      });
    });
});

//  route to remove an product from favourites
router.post("/remove", isLogin, (req, res) => {
  const { productId } = req.body;
  const by = req.user._id;
  FavouritesSchema.findOneAndDelete({ productId, by })
    .then(() => {
      res.json({
        isSuccess: true,
        message: "Product removed from your favourites",
      });
    })
    .catch((err) => {
      res.json({
        isSuccess: false,
        message: "Error removing product from favourites",
        error: err,
      });
    });
});

// get all favourites of a user
router.get("/get", isLogin, (req, res) => {
  const by = req.user._id;
  FavouritesSchema.find({ by })
    .then((favourites) => {
      const allProd = [];
      favourites.forEach((favourite) => {
        ProductSchema.findById(favourite.productId)
          .then((product) => {
            allProd.push(product);
            if (allProd.length === favourites.length) {
              res.json({
                isSuccess: true,
                message: "Favourites fetched successfully",
                favourites: allProd,
              });
            }
          })
          .catch((err) => {
            res.json({
              isSuccess: false,
              message: "Error fetching favourites",
              error: err,
            });
          });
      });
    })
    .catch((err) => {
      res.json({
        message: "Error fetching favourites",
        isSuccess: false,
        err,
      });
    });
});

module.exports = router;
