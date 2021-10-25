// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));


// Separated Routes for each Resource
const usersRoutes = require("./routes/users");
const resourcesRoutes = require("./routes/resources");


// Mount all resource routes
app.use("/api/users", usersRoutes(db));
app.use("/api/resources", resourcesRoutes(db));


// Home page
app.get("/", (req, res) => {
  const userId = req.session.user_id; //*** Depending on what the variable is named in the routes this may have to change.

  res.render("register");

  if(userId) {
    db.query(`SELECT * FROM users WHERE id = $1`, [userId])
    .then(data => {
      console.log(data.rows[0]);
      res.render("index");
    })
    .catch(err => {
      console.log(err);
    });
  }
});


// Server listening at PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
