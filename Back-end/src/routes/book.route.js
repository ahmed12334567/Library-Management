const express = require("express");
const router = express.Router();
const { validationAddBook } = require("../middleware/book.middleware");
const { verify, authorization } = require("../middleware/auth.middleware");
const { generalLimiter } = require("../middleware/reteLimiter.middleware");
const {
  books,
  book,
  addBook,
  importFile,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve book list
 *     description: Returns a paginated list of books with optional search by title/author/ISBN and filtering by category.
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter books by Category ID
 *     responses:
 *       200:
 *         description: Paginated book collection retrieved successfully.
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
 *                     $ref: '#/components/schemas/Book'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 45
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 */
router.get("/", generalLimiter, books);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book details by ID
 *     description: Fetches specific book details by book ID.
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     responses:
 *       200:
 *         description: Book details found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
router.get("/:id", generalLimiter, book);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book (Admin only)
 *     description: Creates a new book entry in the library system.
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
 *         description: Book created successfully.
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
 *                   example: Book added successfully
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 */
router.post("/", verify, generalLimiter, authorization("admin"), validationAddBook, addBook);

/**
 * @swagger
 * /books/import-file:
 *   post:
 *     summary: Bulk import books via CSV (Admin only)
 *     description: Uploads a CSV file to bulk import multiple book records into the library catalog.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file containing book records
 *     responses:
 *       200:
 *         description: CSV processed and books imported successfully.
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
 *                   example: Books imported successfully
 *                 insertedCount:
 *                   type: integer
 *                   example: 25
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 */
router.post("/import-file", generalLimiter, verify, authorization("admin"), importFile);

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     summary: Update book details (Admin only)
 *     description: Modifies existing book details such as title, author, category, or available copy count.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookUpdateInput'
 *     responses:
 *       200:
 *         description: Book updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseSuccess'
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
router.patch("/:id", verify, generalLimiter, authorization("admin"), updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book (Admin only)
 *     description: Removes a book record from the inventory catalog.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     responses:
 *       200:
 *         description: Book deleted successfully.
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
router.delete("/:id", verify, generalLimiter, authorization("admin"), deleteBook);

module.exports = router;