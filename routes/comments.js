const express = require("express");
const router = express();
const { Comments } = require("../models");
const authMiddleWare = require("../middlewares/auth-middleware");
const jwt = require("jsonwebtoken");
// 전체 댓글 조회
router.get("/", async (req, res) => {
  const comments = await Comments.findAll();
  comments.reverse((a, b) => {
    b.createdAt - a.createdAt;
  });
  return res.send(comments);
});

// 댓글 생성
router.post("/:postId", authMiddleWare, async (req, res) => {
  const decode = jwt.decode(req.cookies.token);
  const { postId } = req.params;
  const { content } = req.body;
  if (!content) {
    return res.status(412).json({ errorMessage: "댓글 내용을 입력해 주세요" });
  }
  Comments.create({
    userId: decode.userId,

    postId,
    content,
  });
  return res.status(200).json({ message: "댓글을 생성하였습니다." });
});

// 댓글 수정
router.patch("/:commentId", authMiddleWare, async (req, res) => {
  const decode = jwt.decode(req.cookies.token);
  const { commentId } = req.params;
  const comment = await Comments.findAll({ where: { commentId } });
  console.log(comment[0].userId);

  const { content } = req.body;
  if (decode.userId === comment[0].userId) {
    await Comments.update({ content }, { where: { commentId } });
    return res.status(200).json({ result: "댓글이 수정되었습니다." });
  } else {
    return res.status(400).json({ errorMessage: "작성자만 수정할 수 있습니다." });
  }
});

// 댓글 삭제
router.delete("/:commentId", authMiddleWare, async (req, res) => {
  const { commentId } = req.params;
  const decode = jwt.decode(req.cookies.token);
  const comment = await Comments.findAll({ where: { commentId } });
  if (decode.userId === comment[0].userId) {
    await Comments.destroy({ where: { commentId } });
    res.status(200).json({ result: "댓글이 삭제되었습니다." });
  } else {
    return res.status(400).json({ errorMessage: "작성자만 수정할 수 있습니다." });
  }
});

module.exports = router;
