const express = require("express");
const router = express.Router();
const UsersScheme = require("../../schema/UserSchema");
const ShopSchema = require("../../schema/ShopSchema");
const bcrypt = require("bcrypt");
const passport = require("passport");
const isLogin = require("../../helper/IsLogin");
const multer = require("multer");
const uuid = require("uuid");
const fs = require("fs");

// register route with first name, last name, email, password
router.post("/register", (req, res) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;

  // make sure all fields are filled
  if (!fullName || !email || !password) {
    res.json({
      isSuccess: false,
      message: "Please fill in all fields",
    });
  } else {
    // hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // make sure the user doesn't already exist
    UsersScheme.findOne({ email: email }, (err, user) => {
      if (user) {
        console.log("User already exists");
        res.json({
          isSuccess: false,
          message: "User already exists",
          error: "User already exists",
        });
      } else {
        const newUser = new UsersScheme({
          fullName: fullName,
          email: email,
          password: hashedPassword,
        });
        // save the user
        newUser.save((err) => {
          if (err) {
            res.json({
              isSuccess: false,
              message: "Error registering new user",
              error: err,
            });
          } else {
            res.json({
              isSuccess: true,
              message: "User registered successfully",
            });
          }
        });
      }
    });
  }
});

// login route with email and password
router.post("/login", (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.json({
        isSuccess: false,
        message: "Error logging in",
        error: err,
      });
    }
    if (!user) {
      return res.json({
        isSuccess: false,
        message: "Incorrect email or password",
        error: info,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.json({
          isSuccess: false,
          message: "Error logging in",
          error: err,
        });
      }
      return res.json({
        isSuccess: true,
        message: "User logged in successfully",
      });
    });
  })(req, res);
});

// update full user details
router.post(
  "/update",
  isLogin,
  multer({ storage: multer.memoryStorage() }).single("avatar"),
  (req, res) => {
    // make sure all fields are filled except password
    if (
      !req.body.fullName ||
      !req.body.email ||
      !req.body.phone ||
      !req.body.address ||
      !req.body.about ||
      !req.body.country ||
      !req.body.dateOfBirth
    ) {
      return res.json({
        isSuccess: false,
        message: "Please fill in all fields",
      });
    }
    if (req.file) {
      // upload the image to public/profileImages/{uuid}.{extension}
      const extension = req.file.mimetype.split("/")[1];
      const fileName = `${uuid.v4()}.${extension}`;
      const filePath = `public/profileImages/${fileName}`;
      const fileStream = fs.createWriteStream(filePath);
      fileStream.write(req.file.buffer);
      fileStream.end();

      // update the user
      UsersScheme.findOneAndUpdate(
        { _id: req.user._id },
        {
          fullName: req.body.fullName,
          email: req.body.email,
          phone: req.body.phone,
          avatar: fileName,
          address: req.body.address,
          about: req.body.about,
          country: req.body.country,
          dateOfBirth: req.body.dateOfBirth,
        },
        (err) => {
          if (err) {
            return res.json({
              isSuccess: false,
              message: "Error updating user",
              error: err,
            });
          }
          return res.json({
            isSuccess: true,
            message: "User updated successfully",
          });
        }
      );
    } else {
      // update the user
      UsersScheme.findOneAndUpdate(
        { _id: req.user._id },
        {
          fullName: req.body.fullName,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          about: req.body.about,
          country: req.body.country,
          dateOfBirth: req.body.dateOfBirth,
        },
        (err) => {
          if (err) {
            return res.json({
              isSuccess: false,
              message: "Error updating user",
              error: err,
            });
          }
          return res.json({
            isSuccess: true,
            message: "User updated successfully",
          });
        }
      );
    }
  }
);

// get logged in user info
router.get("/user", async (req, res) => {
  if (req.user) {
    let shopId;
    if (req.user.isSeller) {
      shopId = await ShopSchema.findOne({ ownerId: req.user._id });
    }
    // don't send password

    res.json({
      isLogin: true,
      user: {
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
        country: req.user.country,
        address: req.user.address,
        dateOfBirth: req.user.dateOfBirth,
        about: req.user.about,
        avatar: req.user.avatar,
        isSeller: req.user.isSeller,
        shopId,
      },
    });
  } else {
    res.json({
      isLogin: false,
    });
  }
});

// logout route
router.get("/logout", (req, res) => {
  req.logout();
  return res.status(200).json({
    isSuccess: true,
    message: "User logged out successfully",
  });
});

module.exports = router;
