const express = require("express");
const router = express();
const { Posts, Users } = require("../models");

// 작성자로 조회
router.get("/:userId", async (req, res) => {
  // join Posts -- Users
  const { userId } = req.params;
  const post = await Posts.findAll({ where: { userId } });
  return res.send(post);
});

// 게시물 전체 조회
router.get("/", async (req, res) => {
  const posts = await Posts.findAll();
  return res.send(posts);
});

// 게시글 생성
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

// 게시글 수정
router.patch("/", async (req, res) => {
  const { postId, userId } = req.query;
  const { content } = req.body;
  //   console.log(`postId : ${postId}, userId :${userId}`);
  await Posts.update({ content }, { where: { postId, userId } });
  //   await Posts.updateOne({ postId, userId }, { content });
  res.status(200).json({ result: "게시물이 수정되었습니다." });
});

// 게시글 삭제
router.delete("/", async (req, res) => {
  const { postId, userId } = req.query;
  await Posts.destroy({ where: { postId, userId } });
  res.status(200).json({ result: "게시글이 삭제되었습니다." });
});

module.exports = router;
