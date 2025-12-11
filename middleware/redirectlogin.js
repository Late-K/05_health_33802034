require("dotenv").config();

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect(process.env.HEALTH_BASE_PATH + "/users/login"); // redirect to the login page
  } else {
    next(); // move to the next middleware function
  }
};
module.exports = redirectLogin;
