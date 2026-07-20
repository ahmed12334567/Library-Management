const express = require("express")
const router = express.Router()
const { validationAddBook } = require("../middleware/book.middleware")
const { verify, authorization } = require("../middleware/auth.middleware")
const bookController = require("../controllers/book.controller")

router.get("/",  bookController)
router.get("/:id", bookController)
router.post("/", verify, authorization("admin"), validationAddBook, bookController)
router.post("/import-file", verify, authorization("admin"), bookController)
router.patch("/:id", verify, authorization("admin"), bookController)
router.delete("/:id", verify, authorization("admin"), bookController)

module.exports = router