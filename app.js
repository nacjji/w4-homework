// express 를 불러온다
const express = require("express");
// 불러온 express를 실행한다.
const app = express();
// index router를 indexRouter 변수에 할당한다.
const indexRouter = require("./routes/index");
// models 에서 sequelize 를 불러온다.
const { sequelize } = require("./models");
// cookie를 읽어올 수 있게 하는 cookie parser 를 불러온다.
const cookieParser = require("cookie-parser");

// cookie parser middleware 를 실행한다.
app.use(cookieParser());

// sequelize 를 이용해 db연결 유무를 알려주는 함수
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("sequelize 연결 성공");
  })
  .catch((err) => {
    console.log("sequelize 연결 실패", err);
  });

// bodyparser middleware, exprss 의 매개변수 req, res를 json 형식으로 읽을 수 있게 해주는 미들웨어
app.use(express.json());

// form - urlencode  형식으로 보내는 미들웨어
app.use("/api", express.urlencoded({ extended: false }));

// / 형식의 url을 indexRouter(routes/index.js)로 보낸다.
app.use("/", indexRouter);

// 어떤 포트를 열지 결정하는 이벤트 리스너
app.listen(3000, () => {
  console.log(3000, "has opened");
});
