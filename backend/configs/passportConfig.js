const UserSchema = require("../schema/UserSchema");

const bcrypt = require("bcrypt");

const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await UserSchema.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password" });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    UserSchema.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
