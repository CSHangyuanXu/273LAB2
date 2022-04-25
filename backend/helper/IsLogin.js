function isLogin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.json({
    isSuccess: false,
    message: "User is not authenticated",
    isNotLoggedIn: true,
  });
}

module.exports = isLogin;
