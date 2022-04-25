require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth/authRoute");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const ShopRoutes = require("./routes/shop/ShopRoutes");
const ProductRoute = require("./routes/product/ProductRoute");
const FavouritesRoute = require("./routes/favourites/favouritesRoute");
const PurchaseRoute = require("./routes/purchase/PurchaseRoute");
const app = express();
// global middlewares
app.use(express.static("public"));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(passport.initialize());
app.use(passport.session());
require("./configs/passportConfig")(passport);

//auth routes
app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// serve images in public/producImages and public/shopImages

mongoose
  .connect(
    "mongodb+srv://alisha:OZFzx820FchWc6Vm@cluster0.mfqkn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
  });

//shop routes
app.use("/shop", ShopRoutes);

// Product routes
app.use("/product", ProductRoute);

// favourites routes
app.use("/favourites", FavouritesRoute);

// purchase routes
app.use("/purchase", PurchaseRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
