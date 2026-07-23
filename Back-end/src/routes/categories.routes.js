const express = require("express");
const router = express.Router();
const categorieController = require("../controllers/categories.controller");
const { verify, authorization } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Book classification categories management
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve list of all book categories (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get("/", verify, authorization("admin"), categorieController);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Add a new category (Admin only)
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
 *       200:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: categorie added successfuly
 *                     categorie:
 *                       $ref: '#/components/schemas/Category'
 *       400:
 *         description: Missing or invalid category name
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Category already exists
 */
router.post("/", verify, authorization("admin"), categorieController);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Remove a category by ID (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Target category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Invalid category ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Category does not exist
 */
router.delete("/:id", verify, authorization("admin"), categorieController);

module.exports = router;