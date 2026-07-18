const express = require("express")
const router = express.Router()
const createBorrowBookMiddleware = require("../middleware/borrowedBook.middleware")
const borrowBookController = require("../controllers/borrowedBook.controller")
const { verifyUser, verifyAdmin } = require("../middleware/auth.middleware")

router.post("/", verifyUser, createBorrowBookMiddleware, borrowBookController)
router.get("/get-requsets", verifyAdmin, borrowBookController)
router.get("/borrowed", verifyAdmin, borrowBookController)
router.patch("/:id/Approved", verifyAdmin, borrowBookController) 
router.patch("/:id/Reject", verifyAdmin, borrowBookController) 
router.delete("/", verifyUser, createBorrowBookMiddleware, borrowBookController)

module.exports = router