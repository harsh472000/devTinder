const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFEDATA = "_id firstName lastName skills age gender about photoUrl";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser?._id,
      status: "intrested",
    }).populate("fromUserId", USER_SAFEDATA);
    res.json({
      message: "data fetched successfully",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser?._id, status: "accepted" },
        { fromUserId: loggedInUser?._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFEDATA)
      .populate("toUserId", USER_SAFEDATA);

    const data = connectionRequest?.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser?._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    
    res.send({
      data,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser?._id }, { toUserId: loggedInUser?.id }],
    }).select("fromUserId toUserId");

    const hideRequestFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideRequestFromFeed.add(req.fromUserId.toString());
      hideRequestFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideRequestFromFeed) },
        },
        {
          _id: { $ne: loggedInUser?._id },
        },
      ],
    })
      .select(USER_SAFEDATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = userRouter;
