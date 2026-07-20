const express = require("express")
const router = express.Router()
const createBorrowBookMiddleware = require("../middleware/borrowedBook.middleware")
const borrowBookController = require("../controllers/borrowedBook.controller")
const { verify, authorization } = require("../middleware/auth.middleware")

router.post("/", verify, authorization("user"), createBorrowBookMiddleware, borrowBookController)
router.get("/get-requsets",verify, authorization("admin"), borrowBookController)
router.get("/my-borrowed-books",verify, authorization("user"), borrowBookController)
router.post("/return-book/:id",verify, authorization("user"), borrowBookController)
router.get("/borrowed", verify, authorization("admin"), borrowBookController)
router.patch("/:id/Approved", verify, authorization("admin"), borrowBookController)
router.patch("/:id/Reject", verify, authorization("admin"), borrowBookController)
router.delete("/", verify, authorization("user"), createBorrowBookMiddleware, borrowBookController)

module.exports = router