const express = require("express");
const router = express();
const { Users } = require("../models");

//회원가입
router.post("/", async (req, res) => {
  // nickname, passwor, confirm 을 http body 부분에서 가져온다.
  const { nickname, password, confirm } = req.body;
  // 회원가입 검증을 하기 위한 정규표현식
  const regex = /^[|a-z|A-Z|0-9|]+$/;
  // 중복된 닉네임이 있는지 확인하기 위해 Users 테이블을 탐색한다.
  const isExistNick = await Users.findOne({ where: { nickname } });

  try {
    // 중복되는 닉네임이 있다면
    if (isExistNick) {
      // http status code 412 를 보낸다.
      res.status(412).json({ error: "사용중인 닉네임입니다." });
    }
    // 닉네임이 3글자 이하이고 알파벳 대소문자와 숫자가 아닌 다른게 들어갔다면
    if (nickname.length <= 3 || !regex.test(nickname)) {
      // 412 를 보낸다.
      return res.status(412).json({ errorMessage: "닉네임의 형식이 올바르지 않습니다." });
    }
    // 닉네임에 비밀번호가 포함되어 있다면 412 를 보낸다.
    if (nickname.includes(password)) {
      return res.status(412).json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
    }
    // 비밀번호의 길이가 3글자 이하라면 412 를 보낸다.
    if (password.length <= 3) {
      return res.status(412).json({ errorMessage: "패스워드의 형식이 일치하지 있습니다." });
    }
    // 비밀번호가 비밀번호 확인과 일치하지 않다면 412 를 보낸다.
    if (password !== confirm) {
      return res.status(412).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    // 위 조건을 모두 거치고 유효한 닉네임과 패스워드라면 회원가입을 완료한다.
    const regiUser = await Users.create({ nickname, password });
    res.status(200).json({ result: "회원가입에 성공하였습니다.", regiUser });
    // 위 조건에도 없는 에러라면 400 에러를 보낸다.
  } catch (errorMessage) {
    res.status(400).json({ error: "요청한 데이터 형식이 올바르지 않습니다." });
  }
});

// 해당 라우터를 내보내주는 코드
module.exports = router;
