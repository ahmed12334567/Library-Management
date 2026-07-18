const express = require("express");
const router = express.Router();
const borroweBookModel = require("../models/borrowedBook.model")
const bookModel = require("../models/book.model")
const { asyncHandler } = require("../middleware/error.middleware")
const formateDate = require("../Utility/formateDate")

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

router.get("/get-requsets", asyncHandler(async (req, res) => {
    const requests = await borroweBookModel.getAllBorrowBookReq()
    const formattedRequests = requests.map(row => {
        const formattedDate = formateDate(row.created_at)
        return {
            borrowRusetsID: row.requestid,
            user_id: row.userid,
            username: row.username,
            email: row.email,
            book_id: row.bookid,
            title: row.title,
            stock: row.stock,
            status: row.status,
            date: formattedDate
        };
    })
    return res.status(200).json({
        status: "success",
        data: {
            requests: formattedRequests
        }
    })
}))

router.patch("/:id/Approved", asyncHandler(async (req, res) => {
    const reqId = parseInt(req.params.id)
    if (!Number.isFinite(reqId)) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Invalid requset ID"
            }
        })
    }
    const reqData = await borroweBookModel.getReqBorrowBookById(reqId)
    if (!reqData) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "please check requset ID"
            }
        })
    }
    const user_id = reqData.user_id
    const book_id = reqData.book_id
    const newStatus = {
        status: "Accept",
        id: reqId
    }
    const changeStauts = await borroweBookModel.updateBorrowBookReq(newStatus)
    const decraceStock = await bookModel.updateStock(book_id)


    if (!changeStauts || !decraceStock) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "DB error"
            }
        })
    }
    const newBorrowedBook = {
        userId: user_id,
        bookId: book_id
    }

    const borrowedBook = await borroweBookModel.createBorrowBook(newBorrowedBook)
    return res.status(201).json({
        status: "success",
        data: {
            borrowedBook
        }
    })
}))

router.patch("/:id/Reject", asyncHandler(async (req, res) => {
    const reqId = parseInt(req.params.id)
    if (!Number.isFinite(reqId)) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Invalid requset ID"
            }
        })
    }
    const reqData = await borroweBookModel.getReqBorrowBookById(reqId)
    if (!reqData) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "please check requset ID"
            }
        })
    }
    const newStatus = {
        status: "Rejected",
        id: reqId
    }
    const changeStauts = await borroweBookModel.updateBorrowBookReq(newStatus)


    if (!changeStauts) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "DB error"
            }
        })
    }
    return res.status(200).json({
        status: "success",
        data: {
            message: "The request was successfully rejected"
        }
    })
}))

router.get("/borrowed", asyncHandler(async (req, res) => {
    const borrowBook = await borroweBookModel.getBorrowBookDetails()
    const formattedBorrowed = borrowBook.map(row => {
        const formattedBorrowedDate = formateDate(row.borrow_date)
        const formattedReuturnDate = formateDate(row.return_date)
        return {
            borrowBookId: row.borrow_id,
            user_id: row.userid,
            username: row.username,
            email: row.email,
            book_id: row.bookid,
            title: row.book_title,
            stock: row.stock,
            status: row.status,
            borrow_date: formattedBorrowedDate,
            return_date: formattedReuturnDate,

        };
    })
    return res.status(200).json({
        status: "success",
        data: {
            borrow_books: formattedBorrowed
        }
    })
}))

module.exports = router