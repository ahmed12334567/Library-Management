const express = require("express");
const router = express.Router();
const { validtionReg, validtionLogin, verify, authorization } = require("../middleware/auth.middleware");
const { generalLimiter, authLimiter } = require("../middleware/reteLimiter.middleware");
const {
  register,
  login,
  google,
  me,
  allUsers,
  user,
  changeRole,
  deleteUser,
} = require("../controllers/auth.controller");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with default role `user`. Returns the created user object.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully.
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
 *                   example: User registered successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       409:
 *         $ref: '#/components/responses/409Conflict'
 *       429:
 *         $ref: '#/components/responses/429TooManyRequests'
 */
router.post("/register", authLimiter, validtionReg, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user & get JWT token
 *     description: Validates credentials and returns a JWT access token along with user details.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful. Returns JWT bearer token.
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
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       429:
 *         $ref: '#/components/responses/429TooManyRequests'
 */
router.post("/login", authLimiter, validtionLogin, login);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: OAuth 2.0 Google Sign-In
 *     description: Authenticates or registers a user via Google OAuth idToken.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLoginInput'
 *     responses:
 *       200:
 *         description: Google authentication successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 */
router.post("/google", authLimiter, google);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     description: Returns the user profile details for the currently logged-in user.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 */
router.get("/me", verify, authLimiter, authorization("user"), me);

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: List all registered users (Admin only)
 *     description: Retrieves a list of all registered users with optional search and pagination.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *     responses:
 *       200:
 *         description: User list retrieved successfully.
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
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 */
router.get("/users", verify, generalLimiter, authorization("admin"), allUsers);

/**
 * @swagger
 * /auth/users/{id}:
 *   get:
 *     summary: Get user details by ID (Admin only)
 *     description: Retrieves specific user information by user ID.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     responses:
 *       200:
 *         description: User profile found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
router.get("/users/:id", verify, generalLimiter, authorization("admin"), user);

/**
 * @swagger
 * /auth/users/{id}/role:
 *   patch:
 *     summary: Change user role (Admin only)
 *     description: Promotes or demotes a user's role (`user` or `admin`).
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRoleInput'
 *     responses:
 *       200:
 *         description: User role updated successfully.
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
router.patch("/users/:id/role", verify, generalLimiter, authorization("admin"), changeRole);

/**
 * @swagger
 * /auth/users/{id}:
 *   delete:
 *     summary: Delete a user account (Admin only)
 *     description: Permanently removes a user account from the system.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     responses:
 *       200:
 *         description: User account deleted successfully.
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
router.delete("/users/:id", verify, generalLimiter, authorization("admin"), deleteUser);

module.exports = router;