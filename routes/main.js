// Create a new router
const express = require("express");
const router = express.Router();
const redirectLogin = require("../middleware/redirectlogin");
const request = require("request");
require("dotenv").config();
const { check, validationResult } = require("express-validator");
const dbQueries = require("../utils/dbQueries");
const { getAccessToken } = require("../utils/api");

// Handle our routes
router.get("/", function (req, res, next) {
  res.render("index.ejs");
});

router.get("/about", function (req, res, next) {
  res.render("about.ejs");
});

router.get("/logout", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("./");
    }
    res.redirect(process.env.HEALTH_BASE_PATH + "/users/login");
  });
});

// router.get("/foodslist", (req, res) => {
//   res.render("foodsApi.ejs");
// });

router.get("/foodslist", async (req, res, next) => {
  const searchText = req.query.search_text?.trim() || "apple";

  try {
    const token = await getAccessToken();

    const params = new URLSearchParams({
      method: "foods.search",
      search_expression: searchText,
      format: "json",
    });

    request(
      {
        url:
          "https://platform.fatsecret.com/rest/server.api?" + params.toString(),
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      },
      function (err, response, body) {
        if (err) return next(err);

        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          return res.send("API did not return JSON. Body was:<br><br>" + body);
        }

        let foods = [];

        if (parsed.foods && parsed.foods.food) {
          foods = Array.isArray(parsed.foods.food)
            ? parsed.foods.food
            : [parsed.foods.food];
        }

        res.render("foodsApi.ejs", {
          foods,
          searchText,
        });
      }
    );
  } catch (err) {
    next(err);
  }
});

router.get("/weather", function (req, res, next) {
  res.render("weather.ejs");
});

router.post(
  "/weather_result",
  [check("city").notEmpty()],
  function (req, res, next) {
    let city = req.sanitize(req.body.city);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("./weather");
    } else {
      let url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${process.env.WEATHER_API_KEY}`;
      request(url, function (err, response, body) {
        if (err) {
          next(err);
        } else {
          var weather = JSON.parse(body);
          if (weather !== undefined && weather.main !== undefined) {
            res.render("weather_result.ejs", { weatherData: weather });
          } else {
            res.send("No data found");
          }
        }
      });
    }
  }
);

// Export the router object so index.js can access it
module.exports = router;
