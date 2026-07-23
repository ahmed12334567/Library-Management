const pool = require("../config/db")

const dashboard = {
    getStatistics: async () => {
        const query = `SELECT 
	                    (SELECT COUNT(*) FROM users) AS total_users,
	                    (SELECT COUNT(*) FROM books) AS total_books,
	                    (SELECT COUNT(*) FROM books WHERE stock > 0) AS available_books,
	                    (SELECT COUNT(*) FROM categories) AS total_categories,
	                    (SELECT COUNT(*) FROM borrowedbooks) AS total_borrowedbooks,
	                    (SELECT COUNT(*) FROM borrow_requset WHERE status = 'Pending')
	                    AS total_borrow_requset,
	                    (SELECT COUNT(*) FROM borrowedbooks WHERE status = 'borrowed'
	                    AND return_date < NOW())
	                    AS total_over_date`
        const result = await pool.query(query)
        return result.rows[0]
    }
}

module.exports = dashboard