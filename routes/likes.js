const express = require("express")
const router = express()
const { Likes } = require("../models")
const authMiddleWare = require("../middlewares/auth-middleware")

router.get("/", async (req, res) => {
  const likes = await Likes.findAll()
  return res.send(likes)
})

// 게시글을 params 로 받아
router.put("/:postId/like", authMiddleWare, async (req, res) => {
  const { userId } = res.locals.user
  try {
    const { postId } = req.params
    const like = await Likes.findAll({ where: { postId, userId } })
    // Like = {}
    if (!like.length) {
      await Likes.create({ postId, userId })
      res.status(200).json({ messaage: "게시글에 좋아요를 등록하였습니다." })
    } else {
      await Likes.destroy({ where: { postId, userId } })
      res.status(200).json({ messaage: "게시글에 좋아요를 취소하였습니다." })
    }
  } catch (err) {
    res.status(400).json({ errorMessage: "게시물이 존재하지 않습니다." })
  }
})

module.exports = router
