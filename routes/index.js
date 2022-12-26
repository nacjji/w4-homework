const express = require("express")
const router = express.Router()

const Signup = require("./signup")
const Login = require("./login")
const Posts = require("./posts")
const Comments = require("./comments")
const Likes = require("./likes")

router.use("/login", Login)

router.use("/signup", Signup)
router.use("/posts", Posts)
router.use("/comments", Comments)
router.use("/likes", Likes)

module.exports = router
