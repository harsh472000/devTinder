const express = require("express");
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const {
  validationEditProfile,
  validationPassword,
} = require("../utils/validation");
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validationEditProfile(req)) {
      throw new Error("please enter valid profile");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    res.json({
      message: "Profile updated successfully!",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    validationPassword(req);
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { password: newPasswordHash }
    );
    res.json({
      message: "user updated successfully!!",
      data: updatedUser,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

module.exports = profileRouter;
