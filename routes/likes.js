const express = require("express");
const router = express();
const { Likes, Users, Posts } = require("../models");
const jwt = require("jsonwebtoken");
const authMiddleWare = require("../middlewares/auth-middleware");

router.get("/", async (req, res) => {
  const likes = await Likes.findAll();
  return res.send(likes);
});

// 게시글을 params 로 받아
router.put("/:postId", authMiddleWare, async (req, res) => {
  const decodeUserId = jwt.decode(req.cookies.token);
  const { postId } = req.params;
  const like = await Likes.findAll({ where: { postId, userId: decodeUserId.userId } });
  console.log(like);
  if (!like.length) {
    await Likes.create({ postId, userId: decodeUserId.userId });
    res.send("좋아요!");
  } else {
    await Likes.destroy({ where: { postId, userId: decodeUserId.userId } });
    return res.send("좋아요 취소");
  }
});

// router.post("/", authMiddleWare, async (req, res) => {
//   const decode = jwt.decode(req.cookies.token);
//   const { title, content } = req.body;
//   await Posts.create({ userId: decode.userId, title, content });
//   return res.status(200).json({ message: "게시물을 생성하였습니다." });
// });

module.exports = router;

// 좋아요
// Likes 테이블은 빈 테이블
// 좋아요 요청을 보내면 userId 와 postId create
// Likes 테이블에 userId 와 postId 가 있다면 destroy
