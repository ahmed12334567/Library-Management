const express = require("express");
const router = express.Router();
const dashboardControllers = require("../controllers/dashboard.controller");
const { verify, authorization } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Admin dashboard statistics and metrics
 */

/**
 * @swagger
 * /dashboard/statistics:
 *   get:
 *     summary: Get dashboard statistics summary (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/statistics", verify, authorization("admin"), dashboardControllers);

module.exports = router;