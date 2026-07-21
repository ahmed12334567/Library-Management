const formateDate = require("./formateDate")

const formateBorrowRow = (row) => {
    return {
        borrowId: row.borrow_id,
        userId: row.userid,
        userId: row.user_id,
        username: row.username,
        email: row.email,
        bookId: row.bookid,
        bookId: row.book_id,
        title: row.title,
        stock: row.stock,
        stauts: row.status,
        borrowedDate: formateDate(row.borrow_date),
        returnDate: formateDate(row.return_date)
    }
}
const formateReqRow = (row) => {
    return {
        borrowRusetsID: row.requestid,
        user_id: row.userid,
        username: row.username,
        email: row.email,
        book_id: row.bookid,
        title: row.title,
        stock: row.stock,
        status: row.status,
        date: formateDate(row.created_at)
    }
}

module.exports = { formateBorrowRow, formateReqRow }