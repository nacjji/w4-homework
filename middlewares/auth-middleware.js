const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const SECRET_KEY = "secret-key";

module.exports = (req, res, next) => {
  try {
    const { userId } = jwt.verify(req.cookies.token, SECRET_KEY);
    Users.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({ errorMessage: "로그인 후 이용 가능한 기능입니다." });
  }
};
