const express = require("express");
const router = express.Router();
const { validationAddBook } = require("../middleware/book.middleware");
const { verify, authorization } = require("../middleware/auth.middleware");
const bookController = require("../controllers/book.controller");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book catalog and inventory management endpoints
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get list of books with optional filters
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for book title or author
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category name or ID filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
 */
router.get("/", bookController);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book details by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details retrieved
 *       404:
 *         description: Book not found
 */
router.get("/:id", bookController);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - quantity
 *               - category_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: Clean Architecture
 *               author:
 *                 type: string
 *                 example: Robert C. Martin
 *               description:
 *                 type: string
 *                 example: Software Structure and Design
 *               published_year:
 *                 type: integer
 *                 example: 2017
 *               quantity:
 *                 type: integer
 *                 example: 10
 *               category_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Book added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post("/", verify, authorization("admin"), validationAddBook, bookController);

/**
 * @swagger
 * /books/import-file:
 *   post:
 *     summary: Import books from Excel file (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel spreadsheet file (.xlsx)
 *     responses:
 *       200:
 *         description: Books imported successfully
 *       400:
 *         description: Invalid file format or data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/import-file", verify, authorization("admin"), bookController);

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     summary: Update book details by ID (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               published_year:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
router.patch("/:id", verify, authorization("admin"), bookController);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
router.delete("/:id", verify, authorization("admin"), bookController);

module.exports = router;