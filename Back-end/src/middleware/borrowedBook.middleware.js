const { body, validationResult } = require('express-validator');

const createBorrowBook = [
    body("book_id")
        .notEmpty()
        .isInt()
        .withMessage("enter valid book id"),
    (req, res, next) => {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            const firstError = error.array()[0];
            return res.status(400).json({
                status: "fali",
                data: {
                    message: firstError.msg
                }
            });
        }

        next();
    }
]

module.exports = createBorrowBook