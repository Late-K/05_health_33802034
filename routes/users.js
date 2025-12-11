// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const redirectLogin = require("../middleware/redirectlogin");
const { check, validationResult, checkSchema } = require("express-validator");
const dbQueries = require("../utils/dbQueries");
require("dotenv").config();

const registerValidation = checkSchema({
  email: {
    isEmail: { errorMessage: "Invalid email" },
    isLength: {
      options: { max: 255 },
      errorMessage: "Email max length 255",
    },
    trim: true,
    normalizeEmail: true,
  },

  username: {
    notEmpty: { errorMessage: "Username is required" },
    isLength: {
      options: { min: 5, max: 50 },
      errorMessage: "Username must be 5–50 characters",
    },
    trim: true,
  },

  first: {
    isLength: {
      options: { max: 100 },
      errorMessage: "First name max 100 characters",
    },
    trim: true,
    escape: true,
  },

  last: {
    isLength: {
      options: { max: 100 },
      errorMessage: "Last name max 100 characters",
    },
    trim: true,
    escape: true,
  },

  password: {
    notEmpty: { errorMessage: "Password is required" },
    isLength: {
      options: { min: 8, max: 255 },
      errorMessage: "Password must be 8-255 characters",
    },
    matches: {
      options: /\d/,
      errorMessage: "Password must contain a number",
    },
    custom: {
      options: (value) => /[A-Z]/.test(value),
      errorMessage: "Password must contain an uppercase letter",
    },
  },
});

router.get("/register", function (req, res, next) {
  res.render("register.ejs", { errors: [] });
});

router.post("/registered", registerValidation, function (req, res, next) {
  //sanatise inputs
  req.body.username = req.sanitize(req.body.username);
  req.body.first = req.sanitize(req.body.first);
  req.body.last = req.sanitize(req.body.last);
  req.body.email = req.sanitize(req.body.email);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("register.ejs", { errors: errors.array() });
  } else {
    dbQueries.getUserByUsername(
      req.body.username,
      async (err, existingUser) => {
        if (err) return next(err);

        if (existingUser) {
          return res.render("register.ejs", {
            errors: [{ msg: "Username already exists" }],
          });
        }
        const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
        dbQueries.insertUser(
          req.body.username,
          req.body.first,
          req.body.last,
          req.body.email,
          passwordHash,
          (err, newId) => {
            if (err) return next(err);
            res.render("regSuccess.ejs", { errors: [] });
          }
        );
      }
    );
  }
});

router.get("/list", redirectLogin, function (req, res, next) {
  dbQueries.getAllUsers((err, result) => {
    if (err) return next(err);

    res.render("userlist.ejs", { availableUsers: result });
  });
});

router.get("/login", function (req, res, next) {
  res.render("login.ejs", { errors: [] });
});

router.post("/loggedin", function (req, res, next) {
  req.body.username = req.sanitize(req.body.username.trim());

  dbQueries.getUserByUsername(req.body.username, (err, user) => {
    if (err) return next(err);

    if (!user) {
      dbQueries.insertAuditLog(req.body.username, "unknown username", next);
      return res.render("login.ejs", {
        errors: [{ msg: "Invalid email or password" }],
      });
    }

    bcrypt.compare(
      req.body.password,
      user.password_hash,
      function (err, match) {
        if (err) {
          return next(err);
        } else if (!match) {
          dbQueries.insertAuditLog(
            req.body.username,
            "incorrect password",
            next
          );
          return res.render("login.ejs", {
            errors: [{ msg: "Invalid email or password" }],
          });
        } else {
          dbQueries.insertAuditLog(req.body.username, "logged in", next);

          // Save user session here, when login is successful
          req.session.userId = user.id;
          req.session.username = user.username;
          res.redirect(process.env.HEALTH_BASE_PATH + "/");
        }
      }
    );
  });
});

router.get("/audit", redirectLogin, function (req, res, next) {
  dbQueries.getAuditLogs((err, result) => {
    if (err) {
      return next(err);
    }
    res.render("audit.ejs", { availableAudit: result });
  });
});

// Export the router object so index.js can access it
module.exports = router;
