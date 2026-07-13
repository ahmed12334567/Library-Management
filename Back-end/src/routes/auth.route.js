const express = require("express")
const router = express.Router()
const { validtionReg, validtionLogin , verifyUser} = require("../middleware/auth.middleware")
const authController = require("../controllers/auth.controller")

router.post("/register", validtionReg, authController)
router.post("/login", validtionLogin, authController)
router.get("/me",verifyUser , authController)

module.exports = router