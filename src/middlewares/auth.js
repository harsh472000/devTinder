const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("please login");
    }
    const decodeMessage = jwt.verify(token, "Harsh@123");
    const user = await User.findById(decodeMessage?._id);
    if (!user) {
      throw new Error("user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = { userAuth };
