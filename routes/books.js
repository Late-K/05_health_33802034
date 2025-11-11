// Create a new router
const express = require("express");
const router = express.Router();

router.get("/search", function (req, res, next) {
  res.render("search.ejs");
});

router.get("/search_result", function (req, res, next) {
  //searching in the database
  let sqlquery = "SELECT * FROM books WHERE name LIKE ?"; // query database to get the book with matching name
  // execute sql query
  let searchterm = ["%" + req.query.search_text + "%"];
  db.query(sqlquery, searchterm, (err, result) => {
    if (err) {
      next(err);
    }
    res.render("search_result.ejs", { searchResults: result });
  });
});

router.get("/list", function (req, res, next) {
  let sqlquery = "SELECT * FROM books"; // query database to get all the books
  // execute sql query
  db.query(sqlquery, (err, result) => {
    if (err) {
      next(err);
    }
    res.render("list.ejs", { availableBooks: result });
  });
});

router.get("/addbook", function (req, res, next) {
  res.render("addbook.ejs");
});

router.post("/bookadded", function (req, res, next) {
  // saving data in database
  let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
  // execute sql query
  let newrecord = [req.body.name, req.body.price];
  db.query(sqlquery, newrecord, (err, result) => {
    if (err) {
      next(err);
    } else
      res.send(
        " This book is added to database, name: " +
          req.body.name +
          " price " +
          req.body.price
      );
  });
});

router.get("/bargainbooks", function (req, res, next) {
  let sqlquery = "SELECT * FROM books WHERE price < 20"; // query database to get all the books under £20
  // execute sql query
  db.query(sqlquery, (err, result) => {
    if (err) {
      next(err);
    }
    res.render("bargainbooks.ejs", { availableBooks: result });
  });
});

// Export the router object so index.js can access it
module.exports = router;
