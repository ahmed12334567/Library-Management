const express = require("express");
const router = express.Router();
const borroweBookModel = require("../models/borrowedBook.model")
const { asyncHandler } = require("../middleware/error.middleware")

router.post("/", asyncHandler(async (req, res) =>{
    const userId = req.userId
    const bookId = req.body?.book_id
    const returnDate = req.body?.return_date

    const newBorroweBook = {
        userId,
        bookId,
        returnDate
    }
    const borrowBook = await borroweBookModel.createBorrowBook(newBorroweBook)
    if(!borrowBook){
        return res.status(404).json({
            status: "fail",
            data:{
                message: "Book not found Please check the data"
            }
        })
    }
    return res.status(201).json({
        status: "success",
        data:{
            borrowBook
        }
    })
}))

module.exports = router