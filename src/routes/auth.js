const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationSignUpData } = require("../utils/validation");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validationSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: passwordHash,
    });

    const userData = await user.save();
    const jwttoken = jwt.sign({ _id: userData._id }, "Harsh@123");
    res.cookie("token", jwttoken);
    res.json({ message: "user created successfully!", data: userData });
  } catch (e) {
    res.status(400).send("Error while saving the user" + e.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Please enter valid credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user?.password);
    if (isValidPassword) {
      const jwttoken = jwt.sign({ _id: user._id }, "Harsh@123");
      res.cookie("token", jwttoken);
      res.send(user);
    } else {
      res.status(400).json({
        message: "please enter valid credentials",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "please enter valid credentials",
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});

module.exports = authRouter;
