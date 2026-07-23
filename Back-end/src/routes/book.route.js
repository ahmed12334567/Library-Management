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
 *     summary: Retrieve list of books with optional search, pagination, and category filters
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword for book title or author
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category name or ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of books per page
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
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
 *                     books:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Book'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total: { type: integer, example: 50 }
 *                         page: { type: integer, example: 1 }
 *                         limit: { type: integer, example: 10 }
 */
router.get("/", bookController);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Retrieve detailed information for a specific book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Target book ID
 *     responses:
 *       200:
 *         description: Book details retrieved successfully
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
 *                     book:
 *                       $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid book ID
 *       404:
 *         description: Book not found
 */
router.get("/:id", bookController);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book entry in the library inventory (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: Book created successfully
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
 *                       example: Book added successfully
 *                     book:
 *                       $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error or missing parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 */
router.post("/", verify, authorization("admin"), validationAddBook, bookController);

/**
 * @swagger
 * /books/import-file:
 *   post:
 *     summary: Bulk import books using an uploaded Excel (.xlsx) file (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel spreadsheet file containing book rows (.xlsx)
 *     responses:
 *       200:
 *         description: Excel spreadsheet processed and books imported
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
 *                       example: Books imported successfully
 *                     imported_count:
 *                       type: integer
 *                       example: 25
 *       400:
 *         description: No file uploaded or invalid file format
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
 *     summary: Update book attributes by ID (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Target book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookUpdateInput'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Invalid book ID or payload
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
 *     summary: Remove a book from the catalog by ID (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Target book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       400:
 *         description: Invalid book ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
router.delete("/:id", verify, authorization("admin"), bookController);

module.exports = router;