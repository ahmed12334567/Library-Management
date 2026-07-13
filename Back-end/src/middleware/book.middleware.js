const { body, validationResult } = require('express-validator');

const validationAddBook = [
    body("title")
        .notEmpty()
        .isString()
        .withMessage("invalid title"),
    body("author")
        .notEmpty()
        .isString()
        .withMessage("invalid auther name"),
    body("isbn")
        .notEmpty()
        .withMessage("invalid ISBN"),
    body("price")
        .notEmpty()
        .isFloat({ gt: 0.0, max: 2.0 })
        .withMessage('invalid price number must be bigger than zero')
        .toFloat(),
    body("stock")
        .notEmpty()
        .isInt({ gt: 0 })
        .withMessage('invalid stock number must be bigger than zero')
        .toInt(),
    body("description")
        .notEmpty()
        .isString()
        .isLength({ min: 20 })
        .withMessage("invalid description must by bigger than 20 char"),
    body("categorieId")
        .notEmpty()
        .isInt()
        .withMessage("invalid categoriry"),

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
module.exports = {validationAddBook}