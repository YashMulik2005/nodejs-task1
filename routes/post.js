const express = require("express");
const router = express.Router();
const PostSchema = require("../models/post");
const UserModel = require("../models/user");

router.get("/posts", async (req, res) => {
  try {
    const posts = await PostSchema.find();

    return res.status(200).json({
      data: { posts },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      data: { error: err },
    });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { username, image, caption } = req.body;

    if (username == null) {
      return res.status(200).json({
        data: { error: "Login first to post...." },
      });
    }

    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(200).json({
        data: { error: "username is not valid" },
      });
    }

    const post = new PostSchema({
      username: username,
      image: image,
      caption: caption,
      like: 0,
      comments: [],
    });

    await post.save();

    return res.status(200).json({
      data: { sucess: true },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      data: { error: err },
    });
  }
});

router.post("/update", async (req, res) => {
  try {
    const { post_id, caption, username } = req.body;

    if (username == null) {
      return res.status(200).json({
        data: { error: "Login first to update post...." },
      });
    }

    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(200).json({
        data: { error: "username is not valid" },
      });
    }

    const getpost = await PostSchema.updateOne(
      { _id: post_id },
      { $set: { caption: caption } }
    );

    return res.status(200).json({
      data: { sucess: true },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      data: { error: err },
    });
  }
});

router.post("/like", async (req, res) => {
  try {
    const { post_id, username } = req.body;

    if (username == null) {
      return res.status(200).json({
        data: { error: "Login first to update post...." },
      });
    }

    const existuser = await UserModel.findOne({ username: username });
    if (!existuser) {
      return res.status(200).json({
        data: { error: "username is not valid" },
      });
    }

    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(200).json({
        data: { error: "username is not valid" },
      });
    }

    const liked = await PostSchema.findOne({ _id: post_id });
    const change = await PostSchema.updateOne(
      { _id: post_id },
      { $set: { like: liked.like + 1 } }
    );

    return res.status(200).json({
      data: { sucess: true },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      data: { error: err },
    });
  }
});

router.post("/comment", async (req, res) => {
  try {
    const { post_id, username, comment } = req.body;

    if (username == null) {
      return res.status(200).json({
        data: { error: "Login first to update post...." },
      });
    }

    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(200).json({
        data: { error: "username is not valid" },
      });
    }

    const lastcomments = await PostSchema.findOne({ _id: post_id });

    const newcomments = lastcomments.comments;
    newcomments.unshift(comment[0]);
    console.log(newcomments);

    const addcomment = await PostSchema.updateOne(
      { _id: post_id },
      { $set: { comments: newcomments } }
    );

    return res.status(200).json({
      data: { sucess: true },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      data: { error: err },
    });
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { post_id, username } = req.body;

    if (username == null) {
      return res.status(200).json({
        data: { error: "Login first to update post...." },
      });
    }

    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(200).json({
        data: { error: "username is not valid" },
      });
    }

    const post = await PostSchema.findOne({ _id: post_id });
    if (!post) {
      return res.status(200).json({
        data: { error: "You can not delete other post" },
      });
    }

    const deletepost = await PostSchema.deleteOne({ _id: post_id });

    return res.status(200).json({
      data: { sucess: true },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      data: { error: err },
    });
  }
});

module.exports = router;
