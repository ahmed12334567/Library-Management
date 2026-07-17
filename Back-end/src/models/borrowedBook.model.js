const pool = require("../config/db")

const borrowBook = {
    createBorrowBookReq: async(data) =>{
        const query = `INSERT INTO borrow_requset(user_id, book_id)
        VALUES ($1, $2)
        RETURNING *`
        const values = [data.userId, data.bookId]
        const result = await pool.query(query, values)
        return result.rows[0]
    },
    checkUserHaveReq: async (data) =>{
        const query = `SELECT * FROM borrow_requset WHERE 
        user_id = $1 AND book_id = $2 AND status = 'Pending' `
        const values = [data.userId, data.bookId]
        const result = await pool.query(query, values)
        return result.rows[0]
    },
    deleteBorrowBookReq: async (data) =>{
        const query = `DELETE FROM borrow_requset 
        WHERE book_id = $1 AND user_id = $2 AND status = 'Pending'`
        const values = [data.bookId, data.userId]
        const result = await pool.query(query, values)
        return result.rows[0]
    },

    createBorrowBook: async (data) => {
        const query = `INSERT INTO borrowedbooks(user_id, book_id, return_date)
        VALUES ($1, $2, $3)
        RETURNING *`
        const values = [data.userId, data.bookId, data.returnDate]
        const result = await pool.query(query, values)
        return result.rows[0]
    },
    updateBorrowBook: async (data) => {
        const { id, ...fieldsToUpdate } = data
        const keys = Object.keys(fieldsToUpdate)
        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ")

        const query = `UPDATE borrowedbooks SET ${setClause}
        WHERE id = $${keys.length + 1}
        RETURNING *`
        const values = [...Object.keys(fieldsToUpdate), id]
        const result = await pool.query(query, values)
        return result.rows[0]
    },
    deleteBorroweBookById: async (id) => {
        const query = `DELETE FROM borrowedbooks 
        WHERE id = $1`
        const value = [id]
        const result = await pool.query(query, value)
        return result.rows[0]
    },
    getBorrowBookDetails: async () => {
        const query = `SELECT 
                        borrowedbooks.id AS borrow_id, 
                        users.username, 
                        users.email, 
                        books.title AS book_title, 
                        borrowedbooks.borrow_date, 
                        borrowedbooks.return_date, 
                        borrowedbooks.status
                    FROM borrowedbooks 
                    JOIN users ON borrowedbooks.user_id = users.id
                    JOIN books ON borrowedbooks.book_id = books.id;`
                    const result = await pool.query(query)
                    return result.rows
    }

}

module.exports = borrowBook