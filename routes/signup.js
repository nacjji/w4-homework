const express = require("express");
const router = express();
const { Users } = require("../models");

//회원가입
router.post("/", async (req, res) => {
  const { nickname, password, confirm } = req.body;
  const regex = /^[|a-z|A-Z|0-9|]+$/;
  const isExistNick = await Users.findOne({ where: { nickname } });
  console.log(isExistNick);
  try {
    if (isExistNick) {
      res.status(412).json({ error: "사용중인 닉네임입니다." });
    }
    if (nickname.length <= 3 || !regex.test(nickname)) {
      return res.status(412).json({ errorMessage: "닉네임의 형식이 올바르지 않습니다." });
    }
    if (nickname.includes(password)) {
      return res.status(412).json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
    }
    if (password.length <= 3) {
      return res.status(412).json({ errorMessage: "패스워드의 형식이 일치하지 있습니다." });
    }
    if (password !== confirm) {
      return res.status(412).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    const regiUser = await Users.create({ nickname, password });
    res.status(200).json({ result: "회원가입에 성공하였습니다.", regiUser });
  } catch (errorMessage) {
    console.log(errorMessage);
    res.status(400).json({ error: "요청한 데이터 형식이 올바르지 않습니다." });
  }
});




module.exports = router;
