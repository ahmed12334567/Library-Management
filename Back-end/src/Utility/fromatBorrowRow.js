const formateDate = require("./formateDate")

const formateBorrowRow = (row) => {
    return {
        borrowId: row.borrow_id,
        userId: row.userid,
        userId: row.user_id,
        username: row.username,
        email: row.email,
        bookId: row.bookid,
        title: row.title,
        stock: row.stock,
        stauts: row.status,
        borrowedDate: formateDate(row.borrow_date),
        returnDate: formateDate(row.return_date),
    }
}
const formateReqsRow = (row) => {
    return {
        id: row.id,
        book_id: row.bookid,
        book_title: row.title,
        description: row.description,
        status: row.status,
        requseted_at: formateDate(row.created_at)
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
const formateUsersRows = (row) => {
    return {
        id: row.id,
        username: row.username,
        email: row.email,
        role: row.role,
        google_user: row.google_user,
        join_at: formateDate(row.created_at)
    }
}

module.exports = {
    formateBorrowRow,
    formateReqRow,
    formateReqsRow,
    formateUsersRows
}