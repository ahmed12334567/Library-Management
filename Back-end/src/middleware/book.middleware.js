const { body, validationResult } = require('express-validator');

const validationAddBook = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("invalid title")
        .isString()
        .withMessage("invalid title"),
    body("author")
        .trim()
        .notEmpty()
        .withMessage("invalid auther name")
        .isString()
        .withMessage("invalid auther name"),
    body("isbn")
        .notEmpty()
        .withMessage("invalid ISBN"),
    body("price")
        .notEmpty()
        .withMessage('invalid price number must be bigger than zero')
        .isInt()
        .withMessage('invalid price number must be Number'),
    body("stock")
        .notEmpty()
        .isInt({ gt: 0 })
        .withMessage('invalid stock number must be bigger than zero')
        .toInt()
        .withMessage('invalid price number must be Number'),
    body("description")
        .trim()
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
                status: "fali",
                data: {
                    message: firstError.msg
                }
            });
        }

        next();
    }
]

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // .xlsx
        file.mimetype === 'application/vnd.ms-excel' // .xls
    ) {
        cb(null, true);
    } else {
        req.fileValidationError = 'عذراً، يجب تحميل ملف Excel فقط!';
        cb(null, false);
    }
};

const bookValidationRules = {
    title: {
        notEmpty: { errorMessage: "The title field is required" },
        isString: { errorMessage: "The title must be text" }
    },
    author: {
        notEmpty: { errorMessage: "The author name field is required" },
        isString: { errorMessage: "The author name must be text" }
    },
    isbn: {
        notEmpty: { errorMessage: "The ISBN field is required" }
    },
    price: {
        notEmpty: { errorMessage: "The price field is required" },
        isInt: { errorMessage: "The price must be number" }
    },
    stock: {
        notEmpty: { errorMessage: "The stock field is required" },
        isInt: { errorMessage: "The stock must be number" }
    },
    description: {
        notEmpty: { errorMessage: "The description field is required" }
    },
    categorie_id: {
        notEmpty: { errorMessage: "The categorie id field is required" },
        isInt: { errorMessage: "The categorie id must be number" }
    }
}
module.exports = { validationAddBook, fileFilter, bookValidationRules }