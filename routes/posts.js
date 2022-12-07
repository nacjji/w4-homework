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

// 좋아요한 글만 보여주기
router.get("/likedpost", async (req, res) => {
  try {
    const likedPost = await Likes.findAll({ include: { model: Posts }, required: true });

    return res.status(200).json({ likedPost });
  } catch (errorMessage) {
    res.status(500).json({ errorMessage: "알 수 없는 에러" });
  }
});

// 게시글 상세 조회 // 게시글에 달린 댓글들도 보여주기
router.get("/:postId", async (req, res) => {
  // join Posts -- Users
  try {
    const { postId } = req.params;
    const comments = await Comments.findAll({ where: { postId } });
    const post = await Posts.findAll({ where: { postId } });
    const like = await Likes.findAll({ where: { postId } });
    const nick = await Users.findAll({ where: { userId: post[0].userId } });
    return res.status(200).json({ post, 작성자: nick[0].nickname, comments, like: like.length });
  } catch (errorMessage) {
    res.status(500).json({ errorMessage: "알 수 없는 에러" });
  }
});

// ASC 정렬
// DESC 역순

// 게시물 전체 조회, 좋아요 많은 순으로 정렬
router.get("/", async (req, res) => {
  try {
    const posts = await Posts.findAll({ include: [{ model: Likes }, { model: Comments }], order: [["Likes", "ASC"]] });

    const likesCount = posts.map((value) => {
      return {
        postId: value.postId,
        userId: value.userId,
        title: value.title,
        content: value.content,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
        Likes: value.Likes.length,
        Comments: value.comment,
      };
    });
    return res.send(likesCount);
  } catch (errorMessage) {
    res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
});

// 게시글 생성
router.post("/", authMiddleWare, async (req, res) => {
  try {
    const decode = jwt.decode(req.cookies.token);
    const { title, content } = req.body;
    if (!title) {
      res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
    } else if (!content) {
      res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
    }
    await Posts.create({ userId: decode.userId, title, content });
    return res.status(200).json({ message: "게시물을 생성하였습니다." });
  } catch (errorMessage) {
    res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
  }
});

// 게시글 수정
router.patch("/:postId", authMiddleWare, async (req, res) => {
  try {
    const decodeUserId = jwt.decode(req.cookies.token);
    const { postId } = req.params;
    const { title, content } = req.body;
    if (!title) {
      res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
    } else if (!content) {
      res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
    }
    const post = await Posts.findAll({ where: { postId } });
    if (decodeUserId.userId === post[0].userId) {
      await Posts.update({ title, content }, { where: { postId } });
      return res.status(200).json({ result: "게시물이 수정되었습니다." });
    } else {
      return res.status(400).json({ errorMessage: "작성자만 수정할 수 있습니다." });
    }
  } catch (errorMessage) {
    res.status(400).json({ errorMessage: "존재하지 않는 게시글입니다." });
  }
});

// 게시글 삭제
router.delete("/:postId", authMiddleWare, async (req, res) => {
  try {
    const { postId } = req.params;

    await Posts.destroy({ where: { postId } });
    return res.status(200).json({ result: "게시글이 삭제되었습니다." });
  } catch (errorMessage) {
    return res.status(400).json({ errorMessage: "존재하지 않는 게시글입니다." });
  }
});

module.exports = router;

// 게시물 댓글 완료, 내일 좋아요 기능 하자
// jwt 공부하고
