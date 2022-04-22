const express = require("express");
const router = express.Router();
const UsersScheme = require("../../schema/UserSchema");
const ShopSchema = require("../../schema/ShopSchema");
const ProductSchema = require("../../schema/ProductSchema");
const FavouritesSchema = require("../../schema/FavouritesSchema");
const isLogin = require("../../helper/IsLogin");
const multer = require("multer");
const uuid = require("uuid");
const fs = require("fs");

// route to get created new product
router.post(
  "/create",
  isLogin,
  multer({ storage: multer.memoryStorage() }).single("img"),
  async (req, res) => {
    // make sure all the required fields are filled
    if (
      !req.body.name ||
      !req.body.desc ||
      !req.file ||
      !req.body.price ||
      !req.body.stock
    ) {
      return res.json({
        isSucess: false,
        message: "Please fill all the required fields",
      });
    } else {
      const shop = await ShopSchema.findOne({ ownerId: req.user._id });
      if (!shop) {
        return res.json({
          isSucess: false,
          message: "You need to create a shop first",
        });
      }
      // upload the image to public/productImages/{uuid}.{extension}
      const extension = req.file.mimetype.split("/")[1];
      const fileName = `${uuid.v4()}.${extension}`;
      const filePath = `public/productImages/${fileName}`;
      const fileStream = fs.createWriteStream(filePath);
      fileStream.write(req.file.buffer);
      fileStream.end();

      // create a new product
      const newProduct = new ProductSchema({
        name: req.body.name,
        desc: req.body.desc,
        img: fileName,
        price: req.body.price,
        stock: req.body.stock,
        shopId: shop._id,
      });
      // save the product
      newProduct.save((err) => {
        if (err) {
          return res.json({
            isSuccess: false,
            message: "Something went wrong",
          });
        }
        return res.json({
          isSuccess: true,
          message: "Product created successfully",
        });
      });
    }
  }
);

// route to update a product
router.post(
  "/update",
  isLogin,
  multer({ storage: multer.memoryStorage() }).single("img"),
  async (req, res) => {
    if (req.file) {
      const extension = req.file.mimetype.split("/")[1];
      const fileName = `${uuid.v4()}.${extension}`;
      const filePath = `public/productImages/${fileName}`;
      const fileStream = fs.createWriteStream(filePath);
      fileStream.write(req.file.buffer);
      fileStream.end();
      req.body.img = fileName;

      // update the product
      ProductSchema.findByIdAndUpdate(
        req.body._id,
        {
          name: req.body.name,
          desc: req.body.desc,
          img: fileName,
          price: req.body.price,
          stock: req.body.stock,
        },
        (err) => {
          if (err) {
            return res.json({
              isSuccess: false,
              message: "Something went wrong",
            });
          }
          return res.json({
            isSuccess: true,
            message: "Product updated successfully",
          });
        }
      );
    } else {
      console.log(req.body);
      // update the product
      ProductSchema.findByIdAndUpdate(
        req.body._id,
        {
          name: req.body.name,
          desc: req.body.desc,
          price: req.body.price,
          stock: req.body.stock,
          img: req.body.img,
        },
        (err) => {
          if (err) {
            return res.json({
              isSuccess: false,
              message: "Something went wrong",
            });
          }
          return res.json({
            isSuccess: true,
            message: "Product updated successfully",
          });
        }
      );
    }
  }
);
// route to search for a product
router.get("/search", async (req, res) => {
  // regex to search for the product
  const regex = new RegExp(req.query.search, "i");
  // find the product
  const product = await ProductSchema.find({
    $or: [{ name: regex }, { desc: regex }],
  });
  res.json({
    isSuccess: true,
    message: "Products  found",
    product,
  });
});

// route to get all the products
router.get("/all", async (req, res) => {
  const products = await ProductSchema.find({});
  if (!req.user) {
    res.json({
      isSuccess: true,
      products,
    });
  } else {
    // check if product favourite by the user
    const favouriteProducts = await FavouritesSchema.find({
      by: req.user._id,
    });
    const favouriteProductIds = favouriteProducts.map(
      (product) => product.productId
    );
    const productsWithFavourite = [];

    products.map((product) => {
      if (favouriteProductIds.includes(product._id.toString())) {
        productsWithFavourite.push({
          ...product._doc,
          isFavourite: true,
        });
      } else {
        productsWithFavourite.push({
          ...product._doc,
          isFavourite: false,
        });
      }
    });
    res.json({
      isSuccess: true,
      products: productsWithFavourite,
    });
  }
});

// route to get product by id
router.get("/", async (req, res) => {
  const product = await ProductSchema.findById(req.query.id);
  // get shop details
  const shop = await ShopSchema.findById(product.shopId);

  if (!req.user) {
    res.json({
      isSuccess: true,
      product,
      shop,
    });
  } else {
    // check if product favourite by the user
    const isFavourite = await FavouritesSchema.findOne({
      by: req.user._id,
      productId: product._id,
    });
    console.log(isFavourite);

    res.json({
      isSuccess: true,
      product: {
        ...product._doc,
        isFavourite: isFavourite ? true : false,
      },
      shop,
    });
  }
});

module.exports = router;
