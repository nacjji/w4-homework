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

router.patch("/", async (req, res) => {
  const { commentId, userId } = req.query;
  const { content } = req.body;
  await Comments.update({ content }, { where: { commentId, userId } });
  res.status(200).json({ result: "댓글이 수정되었습니다." });
});

router.delete("/", async (req, res) => {
  const { commentId, userId } = req.query;
  await Comments.destroy({ where: { commentId, userId } });
  res.status(200).json({ result: "댓글이 삭제되었습니다." });
});
module.exports = router;
