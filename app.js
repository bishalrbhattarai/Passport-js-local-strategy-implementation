import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import ejs from "ejs";
import passport from "passport";
const app = express();

import { connectDB, User } from "./db/connectDB.js";
import {
  initializePassport,
  isAuthenticated,
  isLoggedIn,
} from "./passport-config.js";
//connection to the mongoDB database

connectDB();

initializePassport(passport);
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

//Routes
app.get("/", isAuthenticated, (req, res) => {
  res.render("index", { title: "Welcome to the home page" });
});

app.get("/register", (req, res) => {
  res.render(`register`, {
    title: "Register",
  });
});

app.get("/login", isLoggedIn, (req, res) => {
  res.render("login", { title: "Login" });
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ name: username });
    if (user) return res.status(400).send("user already exists");
    const newUser = await User.create({ name: username, password });
    res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
  }
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/register",
  })
);

app.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { value: req.user });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
