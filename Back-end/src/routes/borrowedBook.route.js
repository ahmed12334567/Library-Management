const express = require("express");
const router = express.Router();
const createBorrowBookMiddleware = require("../middleware/borrowedBook.middleware");
const { verify, authorization } = require("../middleware/auth.middleware");
const { generalLimiter } = require("../middleware/reteLimiter.middleware");
const {
  createBorrowBookReq,
  getAllBorrowBookUser,
  borrowBooksReqUser,
  getBorrowBookReq,
  overDate,
  returnBook,
  getBorrowBook,
  approveReq,
  rejectReq,
  deleteBorrowBookReq,
} = require("../controllers/borrowedBook.controller");

/**
 * @swagger
 * /borrow:
 *   post:
 *     summary: Request to borrow a book (User)
 *     description: Creates a new pending borrow request for the authenticated user.
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
 *         description: Borrow request created successfully.
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
 *                   example: Borrow request submitted successfully
 *                 data:
 *                   $ref: '#/components/schemas/BorrowRequest'
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       409:
 *         $ref: '#/components/responses/409Conflict'
 */
router.post(
  "/",
  generalLimiter,
  verify,
  authorization("user"),
  createBorrowBookMiddleware,
  createBorrowBookReq
);

/**
 * @swagger
 * /borrow/my-borrowed-books:
 *   get:
 *     summary: Get my active borrowed books (User)
 *     description: Returns a list of all currently active borrowed books for the logged-in user.
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active borrowed books retrieved successfully.
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
 *                     $ref: '#/components/schemas/BorrowRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 */
router.get(
  "/my-borrowed-books",
  generalLimiter,
  verify,
  authorization("user"),
  getAllBorrowBookUser
);

/**
 * @swagger
 * /borrow/borrow-requests/me:
 *   get:
 *     summary: Get my borrow requests history (User)
 *     description: Returns all borrow request entries (pending, approved, rejected, returned) for the logged-in user.
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrow requests history retrieved successfully.
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
 *                     $ref: '#/components/schemas/BorrowRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 */
router.get(
  "/borrow-requests/me",
  generalLimiter,
  verify,
  authorization("user"),
  borrowBooksReqUser
);

/**
 * @swagger
 * /borrow/get-requsets:
 *   get:
 *     summary: List all pending borrow requests (Admin only)
 *     description: Returns all pending borrow requests awaiting administrator approval or rejection.
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending borrow requests retrieved.
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
 *                     $ref: '#/components/schemas/BorrowRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 */
router.get(
  "/get-requsets",
  generalLimiter,
  verify,
  authorization("admin"),
  getBorrowBookReq
);

/**
 * @swagger
 * /borrow/over-date:
 *   get:
 *     summary: List overdue borrowed books (Admin only)
 *     description: Retrieves all active borrow records where the return date has passed.
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overdue book records retrieved.
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
 *                     $ref: '#/components/schemas/OverdueBorrowRecord'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 */
router.get(
  "/over-date",
  generalLimiter,
  verify,
  authorization("admin"),
  overDate
);

/**
 * @swagger
 * /borrow/return-book/{id}:
 *   post:
 *     summary: Return a borrowed book (User)
 *     description: Marks a currently borrowed book as returned and restores available copy count.
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     responses:
 *       200:
 *         description: Book returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseSuccess'
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
router.post(
  "/return-book/:id",
  generalLimiter,
  verify,
  authorization("user"),
  returnBook
);

/**
 * @swagger
 * /borrow/borrowed:
 *   get:
 *     summary: List all active borrowed books in system (Admin only)
 *     description: Returns all currently active borrowed books across all users.
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All active borrowed books retrieved.
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
 *                     $ref: '#/components/schemas/BorrowRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 */
router.get(
  "/borrowed",
  generalLimiter,
  verify,
  authorization("admin"),
  getBorrowBook
);

/**
 * @swagger
 * /borrow/{id}/Approved:
 *   patch:
 *     summary: Approve a borrow request (Admin only)
 *     description: Approves a pending borrow request, decrementing book available copies and setting return date.
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     responses:
 *       200:
 *         description: Borrow request approved successfully.
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
router.patch(
  "/:id/Approved",
  generalLimiter,
  verify,
  authorization("admin"),
  approveReq
);

/**
 * @swagger
 * /borrow/{id}/Reject:
 *   patch:
 *     summary: Reject a borrow request (Admin only)
 *     description: Rejects a pending borrow request with status `Reject`.
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     responses:
 *       200:
 *         description: Borrow request rejected.
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
router.patch(
  "/:id/Reject",
  generalLimiter,
  verify,
  authorization("admin"),
  rejectReq
);

/**
 * @swagger
 * /borrow/{id}:
 *   delete:
 *     summary: Cancel a pending borrow request (User)
 *     description: Allows a user to cancel their pending borrow request before admin approval.
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     responses:
 *       200:
 *         description: Borrow request cancelled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseSuccess'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
router.delete(
  "/:id",
  generalLimiter,
  verify,
  authorization("user"),
  deleteBorrowBookReq
);

module.exports = router;