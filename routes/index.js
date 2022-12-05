const express = require("express");
const router = express.Router();

const Users = require("./users");
const Auth = require("./auth");
const Posts = require("./posts");
const Comments = require("./comments");

router.use("/api/auth", Auth);
router.use("/api/users", Users);
router.use("/api/posts", Posts);
router.use("/api/comments", Comments);
module.exports = router;
