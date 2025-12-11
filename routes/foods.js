// Create a new router
const express = require("express");
const router = express.Router();
const redirectLogin = require("../middleware/redirectlogin");
const { check, validationResult } = require("express-validator");
const { addfood } = require("../utils/addfood");
const dbQueries = require("../utils/dbQueries");

// router.get("/search", redirectLogin, function (req, res, next) {
//   res.render("search.ejs");
// });

router.get("/search", redirectLogin, function (req, res, next) {
  const searchText = req.query.search_text
    ? req.sanitize(req.query.search_text)
    : "";
  const userId = req.session.userId;
  const callback = (err, foods) => {
    if (err) return next(err);

    res.render("search.ejs", {
      availableFoods: foods,
      searchText: searchText,
    });
  };

  if (searchText) {
    dbQueries.searchFoods(userId, searchText, callback);
  } else {
    dbQueries.getAllFoodsForUser(userId, callback);
  }
});

router.get("/addfood", redirectLogin, function (req, res, next) {
  res.render("addfood.ejs");
});

router.post(
  "/foodadded",
  [check("name").notEmpty().isLength({ max: 50 })],
  function (req, res, next) {
    req.body.name = req.sanitize(req.body.name);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("addfood", { errors: errors.array() });
    }
    const qty = req.body.quantity ? Number(req.body.quantity) : 1;

    addfood(
      req.session.userId,
      req.body.name,
      Number(req.body.calories),
      qty,
      function (err, result) {
        if (err) return next(err);

        res.redirect(process.env.HEALTH_BASE_PATH + "/foods/addfood");
        // res.render("foodadded_success", {
        //   name,
        //   calories,
        //   qty,
        //   updated: result.updated,
        //   newQuantity: result.newQuantity,
        // });
      }
    );
  }
);

router.post("/delete/:foodId", function (req, res, next) {
  const userId = req.session.userId;
  const foodId = req.params.foodId;

  dbQueries.deleteFood(userId, foodId, function (err) {
    if (err) return next(err);

    // Redirect back to the foods list
    res.redirect(process.env.HEALTH_BASE_PATH + "/foods/search");
  });
});

router.get("/logs", redirectLogin, function (req, res, next) {
  dbQueries.getDailySummaries(req.session.userId, function (err, summaries) {
    if (err) return next(err);

    res.render("log_days.ejs", {
      summaries,
    });
  });
});

router.get("/logs/:date", function (req, res, next) {
  const userId = req.session.userId;
  const date = req.params.date; // format: YYYY-MM-DD

  dbQueries.getDailyLog(userId, date, function (err, entries) {
    if (err) return next(err);

    // Calculate daily total calories
    let dailyTotal = entries.reduce(
      (sum, item) => sum + Number(item.total_calories),
      0
    );

    res.render("daily_log.ejs", {
      date,
      entries,
      dailyTotal,
    });
  });
});

router.post("/logs/:date/delete/:logId", function (req, res, next) {
  const userId = req.session.userId;
  const logId = req.params.logId;
  const date = req.params.date;

  dbQueries.deleteLogEntry(logId, userId, function (err) {
    if (err) return next(err);

    // Redirect back to the same day's log
    res.redirect(process.env.HEALTH_BASE_PATH + "/foods/logs/${date}");
  });
});
// Export the router object so index.js can access it
module.exports = router;
