const express = require("express");
const router = express.Router();

const Users = require("./users");
const Auth = require("./auth");
const Posts = require("./posts");
const Comments = require("./comments");
const Likes = require("./likes");

router.use("/api/auth", Auth);
router.use("/api/users", Users);
router.use("/api/posts", Posts);
router.use("/api/comments", Comments);
router.use("/api/likes", Likes);

module.exports = router;
