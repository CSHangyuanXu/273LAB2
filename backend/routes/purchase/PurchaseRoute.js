const express = require("express");
const router = express.Router();
const PurchaseSchema = require("../../schema/PurchaseSchema");
const ProductSchema = require("../../schema/ProductSchema");
const ShopSchema = require("../../schema/ShopSchema");

const isLogin = require("../../helper/IsLogin");

// bulk purchase route
router.post("/bulk", isLogin, async (req, res) => {
  const productsToPurchaseList = JSON.parse(req.body.productsToPurchaseList);
  const userId = req.user._id;
  productsToPurchaseList.forEach(async (product) => {
    const purchase = new PurchaseSchema({
      productId: product._id,
      by: userId,
      quantity: product.qant,
    });
    await purchase.save();
    await ProductSchema.findByIdAndUpdate(
      product._id,
      { $inc: { stock: -product.qant } },
      { new: true }
    );
    // update shop sales
    await ShopSchema.findByIdAndUpdate(
      product.shopId,
      { $inc: { sales: +product.qant } },
      { new: true }
    );

    // update product sales
    await ProductSchema.findByIdAndUpdate(
      product._id,
      { $inc: { sales: +product.qant } },
      { new: true }
    );
  });
  res.json({
    isSuccess: true,
    message: "Purchase Successful",
  });
});

// get purchases by user
router.get("/get", isLogin, async (req, res) => {
  const purchases = await PurchaseSchema.find({ by: req.user._id });
  const products = await ProductSchema.find({
    _id: { $in: purchases.map((p) => p.productId) },
  });
  const shops = await ShopSchema.find({
    _id: { $in: products.map((p) => p.shopId) },
  });
  const purchasesWithProducts = purchases.map((purchase) => {
    const product = products.find(
      (p) => p._id.toString() === purchase.productId
    );
    const shop = shops.find((s) => s._id.toString() === product.shopId);
    return {
      ...purchase.toObject(),
      product: product.toObject(),
      shop: shop.toObject(),
    };
  });
  res.json({
    isSuccess: true,
    message: "Purchases found",
    purchases: purchasesWithProducts,
  });
});

module.exports = router;
