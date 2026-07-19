const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
require("dotenv").config();

const validtionReg = [
    body("username")
        .notEmpty()
        .withMessage("username is required"),
    body("email")
        .notEmpty()
        .isEmail()
        .withMessage("invalid email"),
    body("password")
        .if((value, { req }) => !["true", true].includes(req.body.isGoogleUser))
        .isLength({ min: 8 })
        .withMessage("invalid password min length 8"),
    body("googleIdToken")
        .if((value, { req }) => req.body?.isGoogleUser === true || req.body?.isGoogleUser === "true")
        .notEmpty()
        .withMessage("Google Token Required"),

    (req, res, next) => {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            const firstError = error.array()[0];
            return res.status(400).json({
                success: false,
                message: firstError.msg,
                data: { errors: error.array() }
            });
        }

        next();
    }
]
const validtionLogin = [
    body("email")
        .notEmpty()
        .isEmail()
        .withMessage("invalid email"),
    body("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("invalid password min length 8"),
    (req, res, next) => {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            const firstError = error.array()[0];
            return res.status(400).json({
                success: false,
                message: firstError.msg,
                data: { errors: error.array() }
            });
        }

        next();
    }
]

let JWT_SECRET = process.env.JWT_SECRET;

const verifyUser =
    function verifyUserf(req, res, next) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Token is required" });
        }
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: "Invalid or expired token" });
            }
            if (decoded.role !== "user") {
                return res.status(401).json({
                    status: "fail",
                    data: {
                        message: "Unauthorized"
                    }
                })
            }
            req.userEmail = decoded.email;
            req.userId = decoded.id;
            next();
        });
    }

const verifyAdmin =
    function verifyAdmin(req, res, next) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Token is required" });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: "Invalid or expired token" });
            }
            if (decoded.role !== "admin") {
                return res.status(401).json({
                    status: "fail",
                    data: {
                        message: "Unauthorized"
                    }
                })
            }
            req.adminEmail = decoded.email;
            req.role = decoded.role
            req.adminId = decoded.id;
            next();
        });
    }
module.exports = { validtionReg, validtionLogin, verifyUser, verifyAdmin }