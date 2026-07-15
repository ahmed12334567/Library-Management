const express = require("express")
const router = express.Router()
const {validationAddBook} = require("../middleware/book.middleware")
const bookController = require("../controllers/book.controller")

router.post("/add-book", validationAddBook , bookController)
router.post("/import-books-file" , bookController)

module.exports = router