const express = require("express")
const router = express.Router()
const {validationAddBook} = require("../middleware/book.middleware")
const bookController = require("../controllers/book.controller")

router.post("/", validationAddBook , bookController)
router.post("/import-file" , bookController)
router.patch("/:id" , bookController)
router.delete("/:id" , bookController)

module.exports = router