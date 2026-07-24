const express = require("express");
const router = express.Router();
const { verify, authorization } = require("../middleware/auth.middleware");
const { generalLimiter } = require("../middleware/reteLimiter.middleware");
const {
  categories,
  addCategorie,
  deleteCategorie,
} = require("../controllers/categories.controller");

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List all book categories (Admin only)
 *     description: Retrieves a list of all existing book categories.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category list retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 */
router.get("/", generalLimiter, verify, authorization("admin"), categories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Add a new book category (Admin only)
 *     description: Creates a new category classification for organizing books.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Category added successfully
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 *       409:
 *         $ref: '#/components/responses/409Conflict'
 */
router.post("/", generalLimiter, verify, authorization("admin"), addCategorie);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID (Admin only)
 *     description: Permanently removes a book category by its ID.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseSuccess'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
router.delete("/:id", generalLimiter, verify, authorization("admin"), deleteCategorie);

module.exports = router;