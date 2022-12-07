const express = require("express");
const app = express();
const indexRouter = require("./routes/index");
const { sequelize } = require("./models");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("sequelize 연결 성공");
  })
  .catch((err) => {
    console.log("sequelize 연결 실패", err);
  });

// bodyparser middleware
app.use(express.json());

app.use("/api", express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.listen(5000, () => {
  console.log(5000, "has opened");
});
