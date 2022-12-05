const express = require("express");
const router = express();
const { Posts, Users, Comments } = require("../models");

// 게시글 상세 조회 // 게시글에 달린 댓글들도 보여주기
router.get("/:postId", async (req, res) => {
  // join Posts -- Users
  const { postId } = req.params;
  const comments = await Comments.findAll({ where: { postId } });
  const post = await Posts.findAll({ where: { postId } });
  console.log(comments);
  return res.status(200).json({ post, comments });
});

// 게시물 전체 조회
router.get("/", async (req, res) => {
  const posts = await Posts.findAll();
  return res.send(posts);
});

// 게시글 생성
router.post("/", async (req, res) => {
  const { userId, title, content } = req.body;
  console.log(1231212313213);
  Posts.create({
    userId,
    title,
    content,
  });
  return res.status(200).json({ message: "게시물을 생성하였습니다." });
});

// 게시글 수정
router.patch("/", async (req, res) => {
  // postId 와 userId 를 동시에 가져와서 한번에 작성자 여부를 판단할 수 있음
  const { postId, userId } = req.query;
  const { content } = req.body;
  await Posts.update({ content }, { where: { postId, userId } });
  res.status(200).json({ result: "게시물이 수정되었습니다." });
});

// 게시글 삭제
router.delete("/", async (req, res) => {
  const { postId, userId } = req.query;
  await Posts.destroy({ where: { postId, userId } });
  res.status(200).json({ result: "게시글이 삭제되었습니다." });
});

module.exports = router;
