const express = require("express");
const router = express();
const { Posts, Comments, Likes } = require("../models");
const authMiddleWare = require("../middlewares/auth-middleware");

// 좋아요한 글만 보여주기
router.get("/like", async (req, res) => {
  try {
    // Likes 테이블 모두를 가져오는데, Posts 테이블을 포함해서 가져온다.
    const likedPost = await Likes.findAll({ include: { model: Posts }, required: true });
    return res.status(200).json({ likedPost });
  } catch (errorMessage) {
    res.status(500).json({ errorMessage: "알 수 없는 에러" });
  }
});

// 게시글 상세 조회
router.get("/:postId", async (req, res) => {
  try {
    // params 로 받은 값을 postId 에 담는다.
    const { postId } = req.params;
    const post = await Posts.findAll({
      include: [
        // Comments 테이블에서 commentId 를 제외한 값을 가져온다. (생략해도 되지만 가독성을 위해 생략했다.)(2)
        { model: Comments, attributes: { exclude: ["commentId"] } },
        // 위와 동일(3)
        { model: Likes, attributes: { exclude: ["id"] } },
      ],
      // postId 에 해당하는 글을 가져오는데, (1)
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
    });

    const likesCount = posts
      .map((value) => {
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
      })
      .sort((a, b) => b.Likes - a.Likes);

    return res.status(200).json({ result: likesCount });
  } catch (errorMessage) {
    console.log(errorMessage);
    return res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
});

// 게시글 생성
router.post("/", authMiddleWare, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { title, content } = req.body;
    if (!title) {
      return res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
    } else if (!content) {
      return res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
    }
    await Posts.create({ userId, title, content });
    return res.status(200).json({ message: "게시물을 생성하였습니다." });
  } catch (errorMessage) {
    return res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
  }
});

// 게시글 수정
router.put("/:postId", authMiddleWare, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { title, content } = req.body;
    if (!title) {
      return res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
    } else if (!content) {
      return res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
    }
    const post = await Posts.findOne({ where: { postId, userId } });
    console.log(postId, userId);
    if (!post) {
      return res.status(400).json({ errorMessage: "작성자만 수정할 수 있습니다." });
    }
    await Posts.update({ title, content }, { where: { postId } });
    return res.status(200).json({ result: "게시물이 수정되었습니다." });
  } catch (errorMessage) {
    return res.status(400).json({ errorMessage: "존재하지 않는 게시글입니다." });
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
