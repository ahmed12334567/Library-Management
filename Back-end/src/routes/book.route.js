const express = require("express")
const router = express.Router()
const { validationAddBook } = require("../middleware/book.middleware")
const { verifyAdmin } = require("../middleware/auth.middleware")
const bookController = require("../controllers/book.controller")

router.get("/", verifyAdmin, bookController)
router.get("/:id", verifyAdmin, bookController)
router.post("/", verifyAdmin, validationAddBook, bookController)
router.post("/import-file", verifyAdmin, bookController)
router.patch("/:id", verifyAdmin, bookController)
router.delete("/:id", verifyAdmin, bookController)

module.exports = router