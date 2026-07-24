const express = require("express");
const router = express.Router();
const { statistics } = require("../controllers/dashboard.controller");
const { verify, authorization } = require("../middleware/auth.middleware");
const { generalLimiter } = require("../middleware/reteLimiter.middleware");

/**
 * @swagger
 * /dashboard/statistics:
 *   get:
 *     summary: Retrieve admin analytics dashboard statistics (Admin only)
 *     description: Provides aggregate system metrics including total users, book inventory count, active borrows, pending requests, and overdue totals.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DashboardStatistics'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 */
router.get("/statistics", generalLimiter, verify, authorization("admin"), statistics);

module.exports = router;