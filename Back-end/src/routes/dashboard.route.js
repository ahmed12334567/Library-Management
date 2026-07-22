const express = require("express")
const router = express.Router()
const dashboardControllers = require("../controllers/dashboard.controller")
const { verify, authorization } = require("../middleware/auth.middleware")
router.get("/statistics", verify, authorization("admin"), dashboardControllers)


module.exports = router