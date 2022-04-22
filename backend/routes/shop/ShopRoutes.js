const express = require("express");
const router = express.Router();
const UsersScheme = require("../../schema/UserSchema");
const ShopSchema = require("../../schema/ShopSchema");
const ProductSchema = require("../../schema/ProductSchema");
const multer = require("multer");
const uuid = require("uuid");
const fs = require("fs");
const isLogin = require("../../helper/IsLogin");

// check shop name availability
router.post("/checkShopName", async (req, res) => {
  const { shopName } = req.body;

  const shop = await ShopSchema.findOne({ name: shopName });
  if (shop) {
    res.json({
      isAvailable: false,
    });
  } else {
    res.json({
      isAvailable: true,
    });
  }
});

// create a new shop with name, avatar data coming from the client as multipart/form-data
router.post(
  "/create",
  isLogin,
  multer({ storage: multer.memoryStorage() }).single("avatar"),
  async (req, res) => {
    const name = req.body.name;
    const avatar = req.file;

    // make sure all fields are filled
    if (!name || !avatar) {
      res.json({
        isSuccess: false,
        message: "Please fill in all fields",
      });
    } else {
      // make sure the shop doesn't contain spaces
      if (name.indexOf(" ") !== -1) {
        res.json({
          isSuccess: false,
          message: "Shop name cannot contain spaces",
        });
      } else {
        // make sure the shop doesn't already exist
        ShopSchema.findOne({ name: name }, async (err, shop) => {
          if (shop) {
            res.json({
              isSuccess: false,
              message: "Shop name already exists",
            });
          } else {
            // upload the avatar public/shopImages/{uuid}.{extension}
            const extension = avatar.mimetype.split("/")[1];
            const fileName = `${uuid.v4()}.${extension}`;
            const filePath = `public/shopImages/${fileName}`;
            const fileStream = fs.createWriteStream(filePath);
            fileStream.write(avatar.buffer);
            fileStream.end();

            // create a new shop
            const newShop = new ShopSchema({
              name: name,
              avatar: fileName,
              ownerId: req.user._id,
            });
            // update the user's isSeller field to true on mongoDB
            await UsersScheme.findByIdAndUpdate(req.user._id, {
              isSeller: true,
            });
            // save the shop
            newShop.save((err) => {
              if (err) {
                res.json({
                  isSuccess: false,
                  message: "Error creating new shop",
                  error: err,
                });
              } else {
                res.json({
                  isSuccess: true,
                  message: "Shop created successfully",
                  shopId: newShop._id,
                });
              }
            });
          }
        });
      }
    }
  }
);

// route to get shop details with current user's owner of the shop or not
router.get("/details", async (req, res) => {
  const shopId = req.query.shopId;

  if (req.user) {
    const userId = req.user._id;
    const shop = await ShopSchema.findById(shopId);
    if (shop) {
      const allProductsInShop = await ProductSchema.find({
        shopId: shopId,
      });
      if (shop.ownerId.toString() === userId.toString()) {
        res.json({
          isSuccess: true,
          shop: shop,
          isOwner: true,
          products: allProductsInShop,
        });
      } else {
        res.json({
          isSuccess: true,
          shop: shop,
          isOwner: false,
          products: allProductsInShop,
        });
      }
    } else {
      res.json({
        isSuccess: false,
        message: "Shop not found",
      });
    }
  } else {
    const shop = await ShopSchema.findById(shopId);

    if (shop) {
      const allProductsInShop = await ProductSchema.find({
        shopId: shopId,
      });

      res.json({
        isSuccess: true,
        shop: shop,
        isOwner: false,
        products: allProductsInShop,
      });
    } else {
      res.json({
        isSuccess: false,
        message: "Shop not found",
      });
    }
  }
});

module.exports = router;
