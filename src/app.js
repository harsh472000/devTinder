const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established..");
    app.listen(3000, () => {
      console.log("server running on port 3000");
    });
  })
  .catch((e) => {
    console.log("some error in database");
    console.log(e);
  });

app.listen(3000, () => {
  console.log("server running on port 3000");
});
