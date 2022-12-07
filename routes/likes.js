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
  const decode = jwt.decode(req.cookies.token);
  const { postId } = req.params;

  const like = await Likes.findAll({ where: { userId: decode.userId } });
  console.log(like);
  if (!like.length) {
    await Likes.create({ postId, userId: decode.userId });
    res.send("좋아요!");
  } else {
    await Likes.destroy({ where: { userId: decode.userId } });
    return res.send("좋아요 취소");
  }
});

module.exports = router;
