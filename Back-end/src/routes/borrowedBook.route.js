const express = require("express")
const router = express.Router()
const createBorrowBookMiddleware = require("../middleware/borrowedBook.middleware")
const borrowBookController = require("../controllers/borrowedBook.controller")
const {verifyUser} = require("../middleware/auth.middleware")

router.post("/", verifyUser, createBorrowBookMiddleware, borrowBookController)

module.exports = router