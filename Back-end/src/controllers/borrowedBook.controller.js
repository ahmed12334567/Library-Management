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

router.get("/get-requsets", asyncHandler(async (req, res) => {
    const requests = await borroweBookModel.getAllBorrowBookReq()
    const optionsEn = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    const formattedRequests = requests.map(row => {
        const dateObj = new Date(row.created_at);
        const formattedDate = !isNaN(dateObj.getTime())
            ? dateObj.toLocaleString('en-US', optionsEn)
            : "Invalid Date";
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


    if (!changeStauts) {
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

module.exports = router