//All packages
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

//app variables

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//mongoose code

mongoose.connect("mongodb://127.0.0.1:27017/auth");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const user = new mongoose.model("user", userSchema);

//app code

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new user({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (!err) {
      res.render("login");
    } else {
      console.log(err);
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  let email = req.body.username;
  let password = req.body.password;
  user.findOne({ email: email }, (err, result) => {
    if (!err) {
      if (result) {
        if (result.password == password) {
          res.render("secrets");
        } else {
          console.log("wrong password");
        }
      }
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, () => {
  console.log("App is running at port 3000");
});
