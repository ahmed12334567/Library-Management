const express = require("express");
const router = express.Router();
const dashboardControllers = require("../controllers/dashboard.controller");
const { verify, authorization } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Administrative analytics and metric aggregations
 */

/**
 * @swagger
 * /dashboard/statistics:
 *   get:
 *     summary: Retrieve system-wide statistical metrics (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/DashboardStatistics'
 *       401:
 *         description: Unauthorized (Invalid or missing JWT token)
 *       403:
 *         description: Forbidden (Admin role required)
 */
router.get("/statistics", verify, authorization("admin"), dashboardControllers);

module.exports = router;