const express = require("express");
const router = express();
const { Users } = require("../models");

// 전체회원 조회
router.get("/", async (req, res) => {
  const users = await Users.findAll();
  return res.status(200).send(users);
});

//회원가입
router.post("/", async (req, res) => {
  const { email, nickname, password, confirmPW } = req.body;
  const regex = /^[|a-z|A-Z|0-9|]+$/;

  try {
    if (nickname.length <= 3 || !regex.test(nickname)) {
      return res.status(412).json({ errorMessage: "닉네임의 형식이 올바르지 않습니다." });
    }
    if (password.length <= 3 || nickname.includes(password)) {
      return res.status(412).json({ errorMessage: "비밀번호의 형식이 올바르지 않습니다." });
    }
    if (password !== confirmPW) {
      return res.status(412).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }
    const regiUser = await Users.create({ email, nickname, password });
    res.status(200).json({ result: "회원가입 완료", regiUser });
  } catch (errorMessage) {
    console.log(errorMessage);
    res.status(400).json({ error: "사용중인 이메일 또는 닉네임입니다." });
  }
});

module.exports = router;
