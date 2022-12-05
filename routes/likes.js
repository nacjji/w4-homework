const express = require("express");
const router = express();
const { Likes, Posts, Users } = require("../models");

router.put("/:postId", async (req, res) => {
  console.log(1);
  // 좋아요 누를 게시글
  const { postId } = req.params;
  const { likesId } = req.body;
  const like = await Posts.update({ likesId }, { where: { postId } });

  res.status(200).json({ result: "좋아요!" });
});

module.exports = router;

// like Id 를 불린 값으로 한다.
// 좋아요를 누르면 true 한 번 더 누르면 false
// udpate를 이용해서 변경

// 지금은 body에 1을 넣어서 좋아요를 누르는 방식
// post 를 보내면 좋아요 +1 한걸 변수에 넣어서 업데이트를 할 순 없나
