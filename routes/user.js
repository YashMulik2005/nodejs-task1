const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username: username });

    if (!user) {
      return res.status(200).json({
        data: { error: "username or password is invalid." },
      });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (ismatch) {
      return res.status(200).json({
        data: { sucess: true },
      });
    } else {
      return res.status(200).json({
        data: { error: "username or password is invalid." },
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      data: { error: err },
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existUser = await UserModel.findOne({ username: username });

    if (existUser) {
      return res.status(200).json({
        data: { error: "Username is not available" },
      });
    }

    const hashpass = await bcrypt.hash(password, 10);

    const user = new UserModel({
      username: username,
      email: email,
      password: hashpass,
    });

    await user.save();

    return res.status(200).json({
      data: { success: true },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      data: { error: err },
    });
  }
});

router.post("/changepassword", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(200).json({
        data: { error: "email is not registerd." },
      });
    }

    const char =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let newpass = "";
    for (let i = 0; i < 8; i++) {
      const index = Math.floor(Math.random() * char.length);
      newpass += char.charAt(index);
    }
    const hashpass = await bcrypt.hash(newpass, 10);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.emailuser,
        pass: process.env.emailpassword,
      },
    });

    const mailOptions = {
      from: "yashmulik95@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Your password is get reset. New password is ${newpass}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent successfully!");
      }
    });

    const change = await UserModel.updateOne(
      { email: email },
      { $set: { password: hashpass } }
    );

    if (change) {
      return res.status(200).json({
        data: {
          sucess: "Password get reset. check email to check new password.",
        },
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      data: { error: err },
    });
  }
});

module.exports = router;
