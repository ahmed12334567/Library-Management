const { asyncHandler } = require("../middleware/error.middleware")
const dashboardModel = require("../models/dashboard.model")

const statistics = ("/statistics", asyncHandler(async (req, res) => {
    const statistics = await dashboardModel.getStatistics()
    return res.status(200).json({
        status: "success",
        data: {
            total_users: Number(statistics.total_users),
            total_books: Number(statistics.total_books),
            available_books: Number(statistics.available_books),
            total_categories: Number(statistics.total_categories),
            total_borrowedbooks: Number(statistics.total_borrowedbooks),
            total_borrow_requset: Number(statistics.total_borrow_requset),
            total_over_date: Number(statistics.total_over_date)
        }
    })
}))

module.exports = { statistics }