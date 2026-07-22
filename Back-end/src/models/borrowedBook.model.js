const pool = require("../config/db")

const borrowBook = {
    getReqBorrowBookById: async (id) => {
        const query = `SELECT id, user_id, book_id FROM borrow_requset
        WHERE id = $1 AND status = 'Pending'`
        const vlaue = [id]
        const result = await pool.query(query, vlaue)
        return result.rows[0]
    },
    createBorrowBookReq: async (data) => {
        const query = `INSERT INTO borrow_requset(user_id, book_id)
        VALUES ($1, $2)
        RETURNING *`
        const values = [data.userId, data.bookId]
        const result = await pool.query(query, values)
        return result.rows[0]
    },
    getAllReqsByUserId: async(userId) =>{
        const query = `SELECT borrow_requset.id AS id, books.id AS bookid, title, description, status, borrow_requset.created_at
        FROM borrow_requset 
        JOIN books ON borrow_requset.book_id = books.id
        WHERE borrow_requset.user_id = $1`
        const value = [userId]
        const result = await pool.query(query, value)
        return result.rows
    },
    checkUserHaveReq: async (data) => {
        const query = `SELECT * FROM borrow_requset WHERE 
        user_id = $1 AND book_id = $2 AND status = 'Pending' `
        const value = [data.userId, data.bookId]
        const result = await pool.query(query, value)
        return result.rows[0]
    },
    updateBorrowBookReq: async (data) => {
        const query = `UPDATE borrow_requset 
        SET status = $1 WHERE id = $2 AND status = 'Pending'
        RETURNING *`
        const vlaue = [data.status, data.id]
        const result = await pool.query(query, vlaue)

        return result.rows[0];
    },
    deleteBorrowBookReq: async (data) => {
        const query = `DELETE FROM borrow_requset 
        WHERE book_id = $1 AND user_id = $2 AND status = 'Pending'`
        const values = [data.bookId, data.userId]
        const result = await pool.query(query, values)
        return result.rows[0]
    },
    getAllBorrowBookReq: async () => {
        const query = `SELECT  borrow_requset.id AS requestid, users.id AS userid, 
        users.username, users.email, books.id AS bookid, books.title, books.stock,
        borrow_requset.status, borrow_requset.created_at  FROM borrow_requset 
        JOIN users ON
        borrow_requset.user_id = users.id 
        JOIN books ON
        borrow_requset.book_id = books.id
        WHERE borrow_requset.status = 'Pending' ORDER BY requestid
        `

        console.time('query');
        const result = await pool.query(query);
        console.timeEnd('query');
        return result.rows
    },
    createBorrowBook: async (data) => {
        const query = `INSERT INTO borrowedbooks(user_id, book_id, return_date)
        VALUES ($1, $2, NOW() + INTERVAL '14 days')
        RETURNING *`
        const values = [data.userId, data.bookId]
        const result = await pool.query(query, values)
        return result.rows
    },
    getBorrowBookByUserId: async (userId) =>{
        const query = `SELECT 
                        borrowedbooks.id AS borrow_id,
                        books.id AS bookid,
                        books.title,
                        borrowedbooks.borrow_date, 
                        borrowedbooks.return_date,
                        borrowedbooks.status
                    FROM borrowedbooks
                    JOIN books ON borrowedbooks.book_id = books.id
                    WHERE user_id = $1 AND status = 'borrowed'
                    ORDER BY borrow_date DESC`
        const value = [userId]
        const result = await pool.query(query, value)
        return result.rows
    },
    getBorrowBookByUserIdAndBookId: async (data) =>{
        const query = `SELECT 
                        borrowedbooks.id AS borrow_id,
                        books.id AS bookid,
                        books.title,
                        borrowedbooks.borrow_date, 
                        borrowedbooks.return_date
                    FROM borrowedbooks
                    JOIN books ON borrowedbooks.book_id = books.id
                    WHERE user_id = $1 AND book_id = $2 AND status = 'borrowed'
                    ORDER BY borrow_date DESC`
        const value = [data.userId, data.bookId]
        const result = await pool.query(query, value)
        return result.rows
    },
    updateBorrowStatus: async (id) =>{
        const query = `UPDATE borrowedbooks 
        SET status = 'returned', return_date = NOW()  WHERE id = $1`
        const value = [id]
        const result = await pool.query(query, value)
        return result.rowCount > 0
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
                        users.id AS userid,
                        users.username, 
                        users.email, 
                        books.id AS bookid,
                        books.title, 
                        books.stock AS stock,
                        borrowedbooks.borrow_date, 
                        borrowedbooks.return_date, 
                        borrowedbooks.status
                    FROM borrowedbooks 
                    JOIN users ON borrowedbooks.user_id = users.id
                    JOIN books ON borrowedbooks.book_id = books.id
                    ORDER BY borrow_date DESC`
        const result = await pool.query(query);
        return result.rows
    },
    overDateBorrow: async () =>{
        const query = `SELECT 
                        borrowedbooks.id AS borrow_id, 
                        users.id AS userid,
                        users.username, 
                        users.email, 
                        books.id AS bookid,
                        books.title, 
                        books.stock AS stock,
                        borrowedbooks.borrow_date, 
                        borrowedbooks.return_date, 
                        borrowedbooks.status
                    FROM borrowedbooks 
                    JOIN users ON borrowedbooks.user_id = users.id
                    JOIN books ON borrowedbooks.book_id = books.id
                    WHERE borrowedbooks.return_date < NOW()
                    AND borrowedbooks.status = 'borrowed'
                    ORDER BY borrow_date DESC `
        const result = await pool.query(query);
        return result.rows
    }

}

module.exports = borrowBook