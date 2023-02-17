const express = require("express");
const userrouter = require("./router/user-router");
const adminrouter = require("./router/admin-router");
// const db = require("./db/db");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
// const { json } = require("express");
require("dotenv").config();
//to remove cached data and req server for every req,no caching
const app = express();
app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

const sessionStore = new MongoDBStore({
  uri: process.env.DBURL,
  collection: "sessions",
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static(path.resolve("./public")));

const oneWeek = 1000 * 60 * 60 * 24 * 7;
app.use(
  session({
    secret: "this is my secret code 123@#$^&*",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: oneWeek },
  })
);

app.use("/", userrouter);
app.use("/admin", adminrouter);
app.listen(4000, () => {
  console.log(`server running @ http://localhost:4000`);
});
