const express = require("express")
const router = express.Router()
const categorieController = require("../controllers/categories.controller")
const { verify, authorization } = require("../middleware/auth.middleware")

router.get("/", verify, authorization("admin"), categorieController)
router.post("/", verify, authorization("admin"), categorieController)
router.delete("/:id", verify, authorization("admin"), categorieController)

module.exports = router