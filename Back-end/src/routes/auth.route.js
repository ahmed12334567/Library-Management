const express = require("express")
const router = express.Router()
const { validtionReg, validtionLogin, verify, authorization } = require("../middleware/auth.middleware")
const authController = require("../controllers/auth.controller")

router.post("/register", validtionReg, authController)
router.post("/login", validtionLogin, authController)
router.get("/me", verify, authorization("user"), authController)

module.exports = router