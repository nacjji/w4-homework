const express = require("express")
const router = express.Router()
const { Users } = require("../models")
const SECRET_KEY = "secret-key"
const jwt = require("jsonwebtoken")

router.post("/", async (req, res) => {
  // 만료시간을 60분으로 설정한다.
  try {
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 60)

    const { nickname, password } = req.body

    // 가입된 아이디인지를 확인하기 위해 탐색한다.
    const user = await Users.findOne({ where: { nickname } })
    // 테이블에 없는 닉네임이거나, 비밀번호가 일치하지 않다면 412 에러를 응답한다.
    if (!user || password !== user.password) {
      return res.status(412).send({ errorMessage: "닉네임 또는  패스워드를 확인해주세요." })
    }

    // userId, 닉네임을 token 담고
    const token = jwt.sign({ userId: user.userId, nickname: user.nickname }, SECRET_KEY)
    // token을 헤더에 담아 전송한다.
    res.header("token", token)

    // 만일 로그인이 되어 헤더에 전송된 상태라면 400 에러를 전송한다.
    if (req.header.token) {
      return res.status(400).json({ errorMessage: "이미 로그인된 계정입니다." })
    }

    // 로그인이 완료되면 200 코드와 토큰을 보여준다.
    return res.status(200).json({ token })
  } catch (errorMessage) {
    console.log(errorMessage)
    return res.status(400).json({ errorMessage: "로그인에 실패하였습니다." })
  }
})

// 로그아웃
router.post("/logout", async (req, res) => {
  // 쿠키를 삭제하는 코드
  res.removeHeader("token")
  return res.status(200).json({ message: "로그아웃 되었습니다." })
})

module.exports = router
