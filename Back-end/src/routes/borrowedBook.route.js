const express = require("express");
const router = express.Router();
const createBorrowBookMiddleware = require("../middleware/borrowedBook.middleware");
const borrowBookController = require("../controllers/borrowedBook.controller");
const { verify, authorization } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Borrow
 *   description: Book borrowing workflows, active loans, overdue tracking, and request approval management
 */

/**
 * @swagger
 * /borrow:
 *   post:
 *     summary: Submit a request to borrow a book (User only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BorrowInput'
 *     responses:
 *       201:
 *         description: Borrow request created and set to Pending
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
 *                       example: Borrow book request created successfully
 *                     borrowBookReq:
 *                       $ref: '#/components/schemas/BorrowRequest'
 *       400:
 *         description: Invalid book ID or book unavailable
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User only)
 *       409:
 *         description: User already has pending request or actively borrowed this book
 */
router.post("/", verify, authorization("user"), createBorrowBookMiddleware, borrowBookController);

/**
 * @swagger
 * /borrow/my-borrowed-books:
 *   get:
 *     summary: Get currently active borrowed books for the logged-in user (User only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active borrowed books list
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
 *                     borrowedBooks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: integer, example: 1 }
 *                           bookid: { type: integer, example: 5 }
 *                           title: { type: string, example: "Clean Code" }
 *                           description: { type: string, example: "Software Craftsmanship" }
 *                           borrowed_at: { type: string, format: "date-time" }
 *                           due_date: { type: string, format: "date-time" }
 *       401:
 *         description: Unauthorized
 */
router.get("/my-borrowed-books", verify, authorization("user"), borrowBookController);

/**
 * @swagger
 * /borrow/borrow-requests/me:
 *   get:
 *     summary: Get all borrow requests (Pending, Approved, Rejected) submitted by logged-in user (User only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrow requests list
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
 *                     requests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BorrowRequest'
 *       401:
 *         description: Unauthorized
 */
router.get("/borrow-requests/me", verify, authorization("user"), borrowBookController);

/**
 * @swagger
 * /borrow/get-requsets:
 *   get:
 *     summary: Retrieve all pending borrow requests across all users (Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending borrow requests list
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
 *                     requests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BorrowRequest'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get("/get-requsets", verify, authorization("admin"), borrowBookController);

/**
 * @swagger
 * /borrow/over-date:
 *   get:
 *     summary: List all overdue borrowed books past due date (Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overdue borrow records
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
 *                     overdue:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/OverdueBorrowRecord'
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
 *     summary: Return a borrowed book by loan record ID (User only)
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
 *         description: Book returned successfully, copy restored to library
 *       400:
 *         description: Invalid borrow ID or book already returned
 *       401:
 *         description: Unauthorized
 */
router.post("/return-book/:id", verify, authorization("user"), borrowBookController);

/**
 * @swagger
 * /borrow/borrowed:
 *   get:
 *     summary: Get all active borrowed books system-wide (Admin only)
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
 *     summary: Approve a pending borrow request by request ID (Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Borrow request ID
 *     responses:
 *       200:
 *         description: Borrow request approved and loan record initialized
 *       400:
 *         description: Invalid request ID or request not in Pending state
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
 *     summary: Reject a pending borrow request by request ID (Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Borrow request ID
 *     responses:
 *       200:
 *         description: Borrow request rejected
 *       400:
 *         description: Invalid request ID
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
 *     summary: Cancel/delete a pending borrow request by request ID (User only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Borrow request ID
 *     responses:
 *       200:
 *         description: Request cancelled/deleted successfully
 *       400:
 *         description: Invalid request ID or request not owned by user
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */
router.delete("/:id", verify, authorization("user"), borrowBookController);

module.exports = router;