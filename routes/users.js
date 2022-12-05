const express = require("express");
const router = express();
const { Users } = require("../models");

router.get("/", async (req, res) => {
  const users = await Users.findAll();
  res.send(users);
});

//회원가입
router.post("/", async (req, res) => {
  const { email, nickname, password } = req.body;
  const emailExist = await Users.findAll({ attributes: ["email"], where: { email: email } });
  try {
    const regiUser = await Users.create({
      email,
      nickname,
      password,
    });
    res.status(200).json({ result: "회원가입 완료", regiUser });
  } catch (errorMessage) {
    res.status(400).json({ error: "사용중인 이메일 또는 닉네임입니다." });
  }
});

module.exports = router;
