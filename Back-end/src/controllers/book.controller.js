const express = require("express")
const router = express.Router()
const bookModel = require("../models/book.model")
const { fileFilter, bookValidationRules } = require("../middleware/book.middleware")
const multer = require("multer")
const xlsx = require("xlsx")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/add-book", async (req, res) => {
    try {
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
        const categoryData = await bookModel.geCategorie(categorieId)
        const categorieName = categoryData ? categoryData.name : "Unknown"

        return res.status(201).json({
            status: "success", data: {
                book: {
                    title: book.title,
                    author: book.author,
                    price: book.price,
                    stock: book.stock,
                    description: book.description,
                    categorie: categorieName
                }
            }
        })
    } catch (error) {
        if (error.code === '23505' && error.detail.includes('isbn')) {
            return res.status(409).json({
                status: "fali",
                data: {
                    message: "The ISBN is registered in the database"
                }
            })
        }
        console.log("Error: ", error);
        return res.status(500).json({
            status: "fali", data: {
                message: "Server Error"
            }
        })

    }
})

router.post("/import-books-file", upload.single("bookFile"), async (req, res) => {
    try {
        const file = req.file
        if (!file) {
            return res.status(409).json({
                status: "fali",
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
                status: "fali",
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
                status: "fali",
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

        for(const row of validData){
           categoryIds.add(row.categorie_id) 
        }
        const categorieArray = [...categoryIds]
        const categories = await bookModel.categoryIds(categorieArray)
        const categoryMap = new Map();
        for(const category of categories){
            categoryMap.set(category.id, category.name)
        }
        const books = [];

        for(const book of validData){
            const categorieName = categoryMap.get(book.categorie_id);

            if(!categorieName){
                return res.status(400).json({
                    status: "fali",
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

    } catch (error) {
        if (error.code === '23505' && error.detail.includes('isbn')) {
            return res.status(409).json({
                status: "fali",
                data: {
                    message: "The ISBN is registered in the database"
                }
            })
        }
        console.log("Error: ", error);
        return res.status(500).json({
            status: "fali", data: {
                message: "Server Error"
            }
        })
    }
})

module.exports = router