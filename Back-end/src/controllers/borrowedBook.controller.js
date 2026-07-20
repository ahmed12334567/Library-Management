const express = require("express");
const router = express.Router();
const borroweBookModel = require("../models/borrowedBook.model")
const bookModel = require("../models/book.model")
const { asyncHandler } = require("../middleware/error.middleware")
const formateDate = require("../Utility/formateDate")

router.post("/", asyncHandler(async (req, res) => {
    const { id } = req.user
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
        userId: id,
        bookId: bookId
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
    const { id } = req.user
    const bookId = req.body?.book_id
    const newBorroweBookReq = {
        id,
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
    const decraceStock = await bookModel.decreaseStock(book_id)


    if (!changeStauts || !decraceStock) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "DB error"
            }
        })
    }
    const newBorrowedBook = {
        id: user_id,
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

router.get("/my-borrowed-books", asyncHandler(async (req, res) => {
    const { id } = req.user
    const borrowedBooks = await borroweBookModel.getBorrowBookByUserId(id)
    if (!borrowedBooks) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "borrowed books not found"
            }
        })
    }
    if (borrowedBooks.length > 1) {
        const formattedBorrowed = borrowedBooks.map(row => {
            const formattedBorrowedDate = formateDate(row.borrow_date)
            const formattedReuturnDate = formateDate(row.return_date)
            return {
                borrowBookId: row.borrow_id,
                book_id: row.bookid,
                title: row.title,
                borrow_date: formattedBorrowedDate,
                return_date: formattedReuturnDate,
                status: row.status

            };
        })
        return res.status(200).json({
            status: "success",
            data: {
                borroweBooks: formattedBorrowed
            }
        })
    }
    else {
        const formatBorrowDate = formateDate(borrowedBooks.borrow_date)
        const formatReturnDate = formateDate(borrowedBooks.return_date)
        return res.status(200).json({
            status: "success",
            data: {
                id: borrowedBooks.borrow_id,
                book_id: borrowedBooks.bookid,
                title: borrowedBooks.title,
                borrow_date: formatBorrowDate,
                return_date: formatReturnDate
            }
        })
    }
}))

router.post("/return-book/:id", asyncHandler(async (req, res) => {
    const borrowId = parseInt(req.params.id);
    
    if (!Number.isFinite(borrowId)) {
        return res.status(400).json({
            status: "fail",
            data: { message: "Invalid request ID" }
        });
    }

    const book_id = req.body?.bookId;
    if (!book_id) {
        return res.status(400).json({
            status: "fail",
            data: { message: "Invalid book ID" }
        });
    }

    const { id } = req.user;

    const alreadyBorrowed = await borroweBookModel.getBorrowBookByUserId(id);
    
    if (!alreadyBorrowed || alreadyBorrowed.length === 0) {
        return res.status(400).json({
            status: "fail",
            data: { message: "The user doesn't have any borrowed books" }
        });
    }

    const userData = { userId: id, bookId: book_id };
    const alreadyBorrowedBook = await borroweBookModel.getBorrowBookByUserIdAndBookId(userData);
    
    if (!alreadyBorrowedBook || (Array.isArray(alreadyBorrowedBook) && alreadyBorrowedBook.length === 0)) {
        return res.status(400).json({
            status: "fail",
            data: { message: "This book was not borrowed by this user" }
        });
    }

    const changeStatus = await borroweBookModel.updateBorrowStatus(borrowId);
    const increaseStock = await bookModel.increaseStock(book_id);

    if (!changeStatus || !increaseStock) {
        return res.status(500).json({
            status: "fail",
            data: { message: "Database error occurred" }
        });
    } 

    return res.status(200).json({
        status: "success",
        data: { message: "Book returned successfully" }
    });
}));

module.exports = router