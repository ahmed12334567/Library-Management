const express = require("express")
const router = express.Router()
const { asyncHandler } = require("../middleware/error.middleware")
const dashboardModel = require("../models/dashboard.model")

router.get("/statistics", asyncHandler(async(req, res) =>{
    const statistics = await dashboardModel.getStatistics()
   return res.status(200).json({
    status: "success",
    data: {
        total_users: statistics.total_users,
        total_books: statistics.total_books,
        available_books: statistics.available_books,
        total_categories: statistics.total_categories,
        total_borrowedbooks: statistics.total_borrowedbooks,
        total_borrow_requset: statistics.total_borrow_requset,
        total_over_date: statistics.total_over_date
    }
   })
}))

module.exports = router