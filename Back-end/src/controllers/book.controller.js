const express = require("express");
const router = express.Router();
const bookModel = require("../models/book.model");
const { fileFilter, bookValidationRules } = require("../middleware/book.middleware");
const multer = require("multer");
const xlsx = require("xlsx");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, fileFilter: fileFilter });
const { asyncHandler } = require("../middleware/error.middleware")
const { fromatedBookData } = require("../Utility/fromatBorrowRow")

router.get("/", asyncHandler(async (req, res) => {
    const filters = {
        categorie_id: req.query.categoryId,
        author: req.query.author,
        search: req.query.search,
        maxPrice: req.query.maxPrice,
        minPrice: req.query.minPrice
    };
    const values = [];
    let index = 1;

    const whereClause = Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => {

            if (key === "search") {
                values.push(`%${value}%`);

                return `(title ILIKE $${index}
                     OR author ILIKE $${index}
                     OR description ILIKE $${index++})`
            }

            if (key === "maxPrice") {
                values.push(value)

                return `price <= $${index++}`
            }
            if (key === "minPrice") {
                values.push(value)

                return `price >= $${index++}`
            }
            values.push(value);
            return `${key} = $${index++}`;
        }).join(" AND ");
    const books = await bookModel.getBooksFilters(whereClause, values)
    if (books.length === 0) {
        return res.status(404).json({
            status: "fail",
            data: {
                message: "Book not found Please check the data"
            }
        })
    }
    const formatDate = books.map(fromatedBookData)

    return res.status(200).json({
        status: "success",
        data: {
            number_of_books: formatDate.length,
            books: formatDate
        }
    })
}))

router.get("/:id", asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.id)
    if (!Number.isFinite(bookId)) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Invalid book ID"
            }
        })
    }
    const book = await bookModel.getBookById(bookId)
    if (!book) {
        return res.status(404).json({
            status: "fail",
            data: {
                message: "Book not found Please check the ID"
            }
        })
    }
    const created_at = book.created_at
    const formateDateBook = formateDate(created_at)
    return res.status(200).json({
        status: "success",
        data: {
            title: book.title,
            author: book.author,
            price: book.price,
            stock: book.stock,
            description: book.description,
            created_at: formateDateBook
        }
    })
}))



router.post("/", asyncHandler(async (req, res) => {
    const title = req.body?.title?.trim()
    const author = req.body?.author?.trim()
    const isbn = req.body?.isbn
    const price = req.body?.price
    const stock = req.body?.stock
    const description = req.body?.description?.trim()
    const categorieId = req.body?.categorieId

    const newBook = {
        title: title,
        author: author,
        isbn: isbn,
        price: price,
        stock: stock,
        description: description,
        categorie_id: categorieId
    }

    const book = await bookModel.createBook(newBook)

    return res.status(201).json({
        status: "success", data: {
            book: {
                title: book.title,
                author: book.author,
                price: book.price,
                stock: book.stock,
                description: book.description,
                categorie: book.category_name
            }
        }
    })
}))

router.post("/import-file", upload.single("bookFile"), asyncHandler(async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: req.fileValidationError
            }
        })
    }
    const file = req.file
    if (!file) {
        return res.status(409).json({
            status: "fail",
            data: {
                message: "No file was received"
            }
        })
    }
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[firstSheetName];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    if (jsonData.length === 0) {
        return res.status(409).json({
            status: "fail",
            data: {
                message: "file is empty"
            }
        })
    }
    const column = xlsx.utils.sheet_to_json(workSheet, { header: 1 });
    const columnName = column[0];

    const requiredColumns = [
        'title',
        'author',
        'isbn',
        'price',
        'stock',
        'description',
        'categorie_id'];
    const valid = requiredColumns.every(col => columnName.includes(col))
    if (!valid) {
        return res.status(409).json({
            status: "fail",
            data: {
                message: "worng columns name"
            }
        })
    }


    const allErrors = [];
    const validData = [];
    for (let index = 0; index < jsonData.length; index++) {
        const rows = jsonData[index];
        const rowNumber = index + 2
        const rowErrors = [];


        Object.keys(bookValidationRules).forEach(field => {
            const rules = bookValidationRules[field];
            const value = rows[field];
            if (rules.notEmpty && (value === undefined || value === null || value === '')) {
                rowErrors.push(rules.notEmpty.errorMessage);
            }
            else if (rules.isNumeric && isNaN(Number(value))) {
                rowErrors.push(rules.isNumeric.errorMessage);
            }
        })
        if (rowErrors.length > 0) {
            allErrors.push({
                row: rowNumber,
                details: rowErrors
            })
        } else {
            validData.push(rows)
        }
    }
    if (allErrors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "The file was rejected due to errors in the data cells",
            errorsCount: allErrors.length,
            errors: allErrors
        });
    }
    const categoryIds = new Set();

    for (const row of validData) {
        categoryIds.add(row.categorie_id)
    }
    const categorieArray = [...categoryIds]
    const categories = await bookModel.categoryIds(categorieArray)
    const categoryMap = new Map();
    for (const category of categories) {
        categoryMap.set(category.id, category.name)
    }
    const books = [];

    for (const book of validData) {
        const categorieName = categoryMap.get(book.categorie_id);

        if (!categorieName) {
            return res.status(400).json({
                status: "fail",
                data: {
                    message: `Category (${book.categorie_id}) does not exist`
                }
            })
        }
        books.push({
            ...book,
            category_name: categorieName
        })
    }

    await bookModel.createBooks(validData)
    return res.status(201).json({
        success: true,
        message: `Data successfully verified and ready to be saved for (${books.length}) records`,
        data: {
            books: books
        }
    })

}
))

router.patch("/:id", asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.id)
    if (!Number.isFinite(bookId)) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Invalid book ID"
            }
        })
    }
    const allowedFields = [
        'title',
        'author',
        'isbn',
        'price',
        'stock',
        'description',
        'categorie_id'];
    const data = Object.keys(req.body)
    const valid = data.every(col => allowedFields.includes(col))
    if (!valid) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Enter the fields correctly(title, author, isbn, price, stock, description, categorie_id)"
            }
        })
    }
    const validData = req.body
    const updateData = {}
    for (const book in validData) {
        if (validData[book] !== undefined && validData[book] !== null) {
            updateData[book] = validData[book]
        }
    }
    updateData["id"] = bookId
    if (Object.keys(updateData).length <= 1) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Enter at least one field"
            }
        })
    }

    const updateBook = await bookModel.updateBookById(updateData);
    if (!updateBook) {
        return res.status(404).json({
            status: "fail",
            data: {
                message: "Book not found Please check the ID"
            }
        });
    }
    const categorie_id = updateBook.categorie_id
    const categoryData = await bookModel.getCategorie(categorie_id)
    const categorieName = categoryData ? categoryData.name : "Unknown"

    return res.status(200).json({
        status: "success",
        data: {
            updateBook: {
                title: updateBook.title,
                author: updateBook.author,
                price: updateBook.price,
                stock: updateBook.stock,
                description: updateBook.description,
                categorie: categorieName
            }
        }
    });

}
))

router.delete("/:id", asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.id)
    if (!Number.isFinite(bookId)) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Invalid book ID"
            }
        })
    }
    const deleteBook = await bookModel.deleteBookById(bookId)
    if (!deleteBook) {
        return res.status(404).json({
            status: "fail",
            data: {
                message: "Book not found Please check the ID"
            }
        })
    }
    return res.status(200).json({
        status: "success",
        data: {
            message: "Book deleted successfully"
        }
    })
}
))

module.exports = router