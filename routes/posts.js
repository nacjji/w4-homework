const express = require("express");
const router = express();
const { Posts, Users, Comments, Likes } = require("../models");
const jwt = require("jsonwebtoken");
const authMiddleWare = require("../middlewares/auth-middleware");

// 작성자로 조회
// router.get("/likedpost", async (req, res) => {
//   const userId = jwt.decode(req.cookies.token);
//   console.log(userId);
//   const post = await Posts.findAll({ where: { userId: userId.userId } });
//   return res.status(200).json({ post });
// });

//
router.get("/likedpost", async (req, res) => {
  const userId = jwt.decode(req.cookies.token);

  const likedPost = await Likes.findAll();
  // console.log(likedPost[0].postId);
  // const post = await Posts.findAll({ where: { postId: likedPost[0].postId } });
  // console.log(post);
  return res.status(200).json({ likedPost });
});

// 게시글 상세 조회 // 게시글에 달린 댓글들도 보여주기
router.get("/:postId", async (req, res) => {
  // join Posts -- Users
  const { postId } = req.params;
  const comments = await Comments.findAll({ where: { postId } });
  const post = await Posts.findAll({ where: { postId } });
  const like = await Likes.findAll({ where: { postId } });
  const nick = await Users.findAll({ where: { userId: post[0].userId } });
  return res.status(200).json({ post, 작성자: nick[0].nickname, comments, like: like.length });
});

// 좋아요한 글만 조회

// 게시물 전체 조회
router.get("/", async (req, res) => {
  const decode = jwt.decode(req.cookies.token);
  const posts = await Posts.findAll();
  return res.send(posts);
});

// 게시글 생성
router.post("/", authMiddleWare, async (req, res) => {
  const decode = jwt.decode(req.cookies.token);
  const { title, content } = req.body;
  await Posts.create({ userId: decode.userId, title, content });
  return res.status(200).json({ message: "게시물을 생성하였습니다." });
});

// 게시글 수정
router.patch("/", authMiddleWare, async (req, res) => {
  // postId 와 userId 를 동시에 가져와서 한번에 작성자 여부를 판단할 수 있음
  const { postId, userId } = req.query;
  const { content } = req.body;
  await Posts.update({ content }, { where: { postId, userId } });
  res.status(200).json({ result: "게시물이 수정되었습니다." });
});

// 게시글 삭제
router.delete("/", authMiddleWare, async (req, res) => {
  const { postId, userId } = req.query;
  console.log(postId, userId);
  await Posts.destroy({ where: { postId, userId } });
  res.status(200).json({ result: "게시글이 삭제되었습니다." });
});

module.exports = router;

// 게시물 댓글 완료, 내일 좋아요 기능 하자
// jwt 공부하고
