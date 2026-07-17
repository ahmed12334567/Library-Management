const express = require("express");
const router = express.Router();
const borroweBookModel = require("../models/borrowedBook.model")
const bookModel = require("../models/book.model")
const { asyncHandler } = require("../middleware/error.middleware")

router.post("/", asyncHandler(async (req, res) => {
    const userId = req.userId
    const bookId = req.body?.book_id


    const availableBookInStock = await bookModel.getBookById(bookId)
    if (!availableBookInStock || availableBookInStock.stock <= 0) {
        return res.status(404).json({
            status: "fail",
            data: {
                message: "book not available"
            }
        })
    }
    const newBorroweBookReq = {
        userId,
        bookId
    }
    const checkUserHaveReq = await borroweBookModel.checkUserHaveReq(newBorroweBookReq)
    if (checkUserHaveReq) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "You already have a pending request for this book"
            }
        })
    }
    const borrowBook = await borroweBookModel.createBorrowBookReq(newBorroweBookReq)
    if (!borrowBook || borrowBook === null) {
        return res.status(404).json({
            status: "fail",
            data: {
                message: "Book not found Please check the data"
            }
        })
    }
    return res.status(201).json({
        status: "success",
        data: {
            message: "Your request has been successfully submitted; awaiting a response"
        }
    })
}))

router.delete("/", asyncHandler(async (req, res) => {
    const userId = req.userId
    const bookId = req.body?.book_id
    const newBorroweBookReq = {
        userId,
        bookId
    }
    const checkUserHaveReq = await borroweBookModel.checkUserHaveReq(newBorroweBookReq)
    if (!checkUserHaveReq) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "You don't have a pending request for this book."
            }
        })
    }

    await borroweBookModel.deleteBorrowBookReq(newBorroweBookReq)

    return res.status(200).json({
        status: "success",
        data: null
    })
}))

module.exports = router