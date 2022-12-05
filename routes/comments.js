const express = require("express");
const router = express();
const { Comments } = require("../models");

router.get("/", async (req, res) => {
  const comments = await Comments.findAll();

  return res.send(comments);
});

router.post("/", async (req, res) => {
  const { userId, postId, nickname, content } = req.body;
  Comments.create({
    userId,
    nickname,
    postId,
    content,
  });
  return res.status(200).json({ message: "댓글을 생성하였습니다." });
});

module.exports = router;
