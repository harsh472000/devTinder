const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["intrested", "ignored"];
    if (!allowedStatus.includes(status)) {
      throw new Error("status is not allowed");
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (existingConnectionRequest) {
      throw new Error("Connection is alredy exist");
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "user Not found!!" });
    }

    const newConnectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await newConnectionRequest.save();
    res.json({
      message: "Connection request successfully",
      data,
    });
    try {
    } catch (error) {
      res.status(404).json({
        message: error.message,
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Plese enter valid status");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "intrested",
      });

      if (!connectionRequest) {
        throw new Error("Connection Request Not found");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();
      res.json({
        message: "connection Request " + status,
        data,
      });
    } catch (error) {
      res.status(404).json({
        message: "Error " + error.message,
      });
    }
  }
);

module.exports = requestRouter;
