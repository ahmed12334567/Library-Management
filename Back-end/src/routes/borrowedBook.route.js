const express = require("express");
const router = express.Router();
const createBorrowBookMiddleware = require("../middleware/borrowedBook.middleware");
const borrowBookController = require("../controllers/borrowedBook.controller");
const { verify, authorization } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Borrow
 *   description: Book borrowing and request management endpoints
 */

/**
 * @swagger
 * /borrow:
 *   post:
 *     summary: Request to borrow a book (User only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book_id
 *             properties:
 *               book_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Borrow request created
 *       400:
 *         description: Already requested or book unavailable
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User only)
 */
router.post("/", verify, authorization("user"), createBorrowBookMiddleware, borrowBookController);

/**
 * @swagger
 * /borrow/my-borrowed-books:
 *   get:
 *     summary: Get currently borrowed books of logged-in user
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of currently borrowed books
 *       401:
 *         description: Unauthorized
 */
router.get("/my-borrowed-books", verify, authorization("user"), borrowBookController);

/**
 * @swagger
 * /borrow/borrow-requests/me:
 *   get:
 *     summary: Get borrowing requests of logged-in user
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user borrowing requests
 *       401:
 *         description: Unauthorized
 */
router.get("/borrow-requests/me", verify, authorization("user"), borrowBookController);

/**
 * @swagger
 * /borrow/get-requsets:
 *   get:
 *     summary: Get all pending borrow requests (Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending borrow requests
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/get-requsets", verify, authorization("admin"), borrowBookController);

/**
 * @swagger
 * /borrow/over-date:
 *   get:
 *     summary: Get overdue borrowed books (Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of overdue borrowed books
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/over-date", verify, authorization("admin"), borrowBookController);

/**
 * @swagger
 * /borrow/return-book/{id}:
 *   post:
 *     summary: Return a borrowed book (User only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Borrow record ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Borrow record not found
 */
router.post("/return-book/:id", verify, authorization("user"), borrowBookController);

/**
 * @swagger
 * /borrow/borrowed:
 *   get:
 *     summary: Get all active borrowed books across system (Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all active borrowed books
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/borrowed", verify, authorization("admin"), borrowBookController);

/**
 * @swagger
 * /borrow/{id}/Approved:
 *   patch:
 *     summary: Approve a borrow request (Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request approved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Request not found
 */
router.patch("/:id/Approved", verify, authorization("admin"), borrowBookController);

/**
 * @swagger
 * /borrow/{id}/Reject:
 *   patch:
 *     summary: Reject a borrow request (Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request rejected
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Request not found
 */
router.patch("/:id/Reject", verify, authorization("admin"), borrowBookController);

/**
 * @swagger
 * /borrow/{id}:
 *   delete:
 *     summary: Cancel/delete a pending borrow request (User only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request deleted/cancelled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */
router.delete("/:id", verify, authorization("user"), borrowBookController);

module.exports = router;