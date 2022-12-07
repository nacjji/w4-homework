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
  try {
    const { postId } = req.params;
    const like = await Likes.findAll({ where: { postId, userId: decodeUserId.userId } });
    if (!like.length) {
      await Likes.create({ postId, userId: decodeUserId.userId });
      res.send("좋아요!");
    } else {
      await Likes.destroy({ where: { postId, userId: decodeUserId.userId } });
      return res.send("좋아요 취소");
    }
  } catch (err) {
    res.status(400).json({ errorMessage: "게시물이 존재하지 않습니다." });
  }
});

module.exports = router;
