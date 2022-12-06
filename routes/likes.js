const express = require("express");
const router = express();
const { Likes, Users, Posts } = require("../models");

router.get("/", async (req, res) => {
  const likes = await Likes.findAll();
  return res.send(likes);
});

router.put("/", async (req, res) => {
  const { postId, userId } = req.body;
  const like = await Likes.findAll({ where: { userId } });
  if (like.length) {
    await Likes.destroy({ where: { userId } });
    return res.send("좋아요 취소");
  } else {
    await Likes.create({ postId, userId });
    res.send("좋아요!");
  }

  //   await Likes.create({ postId, userId });
  //   return res.status(200).json({ result: "좋아요!" });
});

module.exports = router;
