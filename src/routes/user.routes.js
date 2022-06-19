const express = require("express")
const router = express.Router()

const authControllers = require("../controllers/auth.controllers")

router.post("/signup", authControllers.signUp)
router.post("/login", authControllers.login)

module.exports = router
