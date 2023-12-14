const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const userroute = require("./routes/user");
const postroute = require("./routes/post");
require("dotenv").config();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

mongoose.set("strictQuery", false);
const db = `mongodb+srv://${process.env.Mongoodbusername}:${process.env.Mongoodbpassword}@cluster0.yhk9ex5.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/user", userroute);
app.use("/post", postroute);

app.listen(3000, () => {
  console.log("server runnig.");
});
