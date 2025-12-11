// Import express, ejs, mysql2, path and dotnev
var express = require("express");
var ejs = require("ejs");
var mysql = require("mysql2");
const path = require("path");
require("dotenv").config();
var session = require("express-session");
const expressSanitizer = require("express-sanitizer");
const expressLayouts = require("express-ejs-layouts");

// Create the express application object
const app = express();
const port = process.env.PORT || 8000;

// Tell Express that we want to use EJS as the templating engine
app.set("view engine", "ejs");

// Set up the body parser
app.use(express.urlencoded({ extended: true }));

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, "public")));

// Set up layouts
app.use(expressLayouts);
app.set("layout", "layout");

// Create an input sanitizer
app.use(expressSanitizer());

// Define the database connection pool
const db = mysql.createPool({
  host: process.env.HEALTH_HOST,
  user: process.env.HEALTH_USER,
  password: process.env.HEALTH_PASSWORD,
  database: process.env.HEALTH_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
global.db = db;

// Create a session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "somerandomstuff",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  res.locals.username = req.session.username || null;
  res.locals.isAuthenticated = !!req.session.userId;
  res.locals.HEALTH_BASE_PATH = process.env.HEALTH_BASE_PATH || "";
  next();
});

// Load the route handlers
const mainRoutes = require("./routes/main");
app.use("/", mainRoutes);

// Load the route handlers for /users
const usersRoutes = require("./routes/users");
app.use("/users", usersRoutes);

// Load the route handlers for /books
const foodsRoutes = require("./routes/foods");
app.use("/foods", foodsRoutes);

// error handle
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something broke!<br>" + error.message);
});

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
