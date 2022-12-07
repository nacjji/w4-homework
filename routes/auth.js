const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const SECRET_KEY = "secret-key";
const jwt = require("jsonwebtoken");

//
router.post("/", async (req, res) => {
  // 만료시간 설정
  try {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 60);

    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user || password !== user.password) {
      return res.status(412).send({ errorMessage: "아이디 또는  패스워드를 확인해주세요." });
    }

    const token = jwt.sign({ email: user.email, password: user.password, userId: user.userId, nickname: user.nickname }, SECRET_KEY);
    res.cookie("token", token);
    if (req.cookies.token) {
      return res.status(400).json({ errorMessage: "이미 로그인된 계정입니다." });
    }
    return res.status(200).json({ token });
  } catch (errorMessage) {
    return res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });
  }
});

// 로그아웃
router.post("/logout", async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "로그아웃 되었습니다." });
});

module.exports = router;
