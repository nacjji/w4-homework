const jwt = require("jsonwebtoken")
const { Users } = require("../models")
const SECRET_KEY = "secret-key"

module.exports = (req, res, next) => {
  try {
    const [tokenType, tokenValue] = req.headers.authorization.split(" ")

    if (!tokenType || !tokenValue) {
      return res.status(400).json({ errorMessage: "로그인이 후 이용 가능한 기능입니다." })
    }
    // 전송된 토큰을 검증해 토큰에 담긴 userId를 userId 에 담고
    const { userId } = jwt.verify(tokenValue, SECRET_KEY)
    // userId를 이용해 현재 로그인 된 사용자가 누구인지 res.locals 를 이용해 확인한다. 이는 게시글, 댓글 작성, 좋아요 등 회원의 정보를 담아 사용할 때 사용된다.
    Users.findByPk(userId).then((user) => {
      res.locals.user = user
      // 위 작업이 끝나면 다음 미들웨어로 보낸다.
      next()
    })
    // 위 검증에 실패한 경우 쿠키가 담겨있지 않은 비회원이기 때문에 401 상태코드를 전송한다.
  } catch (err) {
    console.log(err)
    res.status(401).send({ errorMessage: "로그인 후 이용 가능한 기능입니다." })
  }
}
