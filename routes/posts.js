const express = require("express");
const router = express();
const { Posts } = require("../models");

router.get("/", async (req, res) => {
  const posts = await Posts.findAll();

  return res.send(posts);
});

router.post("/", async (req, res) => {
  const { userId, nickname, title, content } = req.body;
  const post = Posts.create({
    userId,
    nickname,
    title,
    content,
  });
  return res.status(200).json({ message: "게시물을 생성하였습니다." });
});

module.exports = router;
