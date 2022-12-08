const express = require("express");
const router = express();
const { Posts, Comments, Likes } = require("../models");
const authMiddleWare = require("../middlewares/auth-middleware");
const sequelize = require("sequelize");


// 좋아요한 글만 보여주기
router.get("/like", async (req, res) => {
  try {
    const likedPost = await Likes.findAll({ include: { model: Posts }, required: true });

    return res.status(200).json({ likedPost });
  } catch (errorMessage) {
    res.status(500).json({ errorMessage: "알 수 없는 에러" });
  }
});

router.get("/:postId", async (req, res) => {
  // join Posts -- Users
  try {
    const { postId } = req.params;
    const post = await Posts.findAll({
      include: [
        { model: Comments, attributes: { exclude: ["commentId"] } },
        { model: Likes, attributes: { exclude: ["id"] } },
      ],
      where: { postId },
    });
    return res.status(200).json({ result: post });
  } catch (errorMessage) {
    res.status(500).json({ errorMessage: "알 수 없는 에러" });
  }
});

// 게시물 전체 조회, 좋아요 많은 순으로 정렬
router.get("/", async (req, res) => {
  try {
    const posts = await Posts.findAll({
      include: [{ model: Likes }, { model: Comments }],
      // order: [["Likes", "asc"]],
    });

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
    const { userId } = res.locals.user;
    const { title, content } = req.body;
    if (!title) {
      res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
    } else if (!content) {
      res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
    }
    await Posts.create({ userId, title, content });
    return res.status(200).json({ message: "게시물을 생성하였습니다." });
  } catch (errorMessage) {
    res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
  }
});

// 게시글 수정
router.put("/:postId", authMiddleWare, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { title, content } = req.body;
    if (!title) {
      res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
    } else if (!content) {
      res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
    }
    const post = await Posts.findAll({ where: { postId } });
    if (userId === post[0].userId) {
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
