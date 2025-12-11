// Create a new router
const express = require("express");
const router = express.Router();
const redirectLogin = require("../middleware/redirectlogin");
const { check, validationResult } = require("express-validator");
const { addfood } = require("../utils/addfood");
const dbQueries = require("../utils/dbQueries");

router.get("/search", redirectLogin, function (req, res, next) {
  const searchText = req.query.search_text
    ? req.sanitize(req.query.search_text)
    : "";
  const callback = (err, foods) => {
    if (err) return next(err);

    res.render("search.ejs", {
      availableFoods: foods,
      searchText: searchText,
    });
  };

  if (searchText) {
    dbQueries.searchFoods(req.session.userId, searchText, callback);
  } else {
    dbQueries.getAllFoodsForUser(req.session.userId, callback);
  }
});

router.get("/addfood", redirectLogin, function (req, res, next) {
  res.render("addfood.ejs", { errors: [] });
});

router.post(
  "/foodadded",
  [
    check("name").notEmpty().isLength({ max: 50 }),
    check("calories").isInt({ min: 0, max: 99999 }),
    check("quantity").optional().isInt({ min: 0.1, max: 999 }),
  ],
  function (req, res, next) {
    req.body.name = req.sanitize(req.body.name);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("addfood.ejs", { errors: errors.array() });
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
      }
    );
  }
);

router.post("/delete/:foodId", function (req, res, next) {
  dbQueries.deleteFood(req.session.userId, req.params.foodId, function (err) {
    if (err) return next(err);
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

router.get("/logs/:date", redirectLogin, function (req, res, next) {
  const date = req.params.date;
  dbQueries.getDailyLog(req.session.userId, date, function (err, entries) {
    if (err) return next(err);

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
  dbQueries.deleteLogEntry(
    req.params.logId,
    req.session.userId,
    function (err) {
      if (err) return next(err);

      res.redirect(
        process.env.HEALTH_BASE_PATH + "/foods/logs/" + req.params.date
      );
    }
  );
});
// Export the router object so index.js can access it
module.exports = router;
