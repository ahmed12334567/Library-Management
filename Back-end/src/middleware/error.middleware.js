require("dotenv").config()
const logger = require("../logger")
const handleError = function (err, req, res, next) {
    if (process.env.NODE_ENV === 'production') {
        console.error("server error:", err.message);
    } else {
        logger.error({ err }, 'Server error occurred')
    }

    if (err.code === '23505') {
        let message = "This data already exists";

        if (err.detail) {
            const matches = err.detail.match(/\((.*?)\)=\((.*?)\)/);
            if (matches && matches[2]) {
                message = `The ISBN or unique value (${matches[2]}) already exists in our database`;
            }
        }
        return res.status(409).json({
            status: "fail",
            data: {
                message: message,
                constraint: err.constraint
            }
        });
    }

    if (err.code === '23503') {
        return res.status(409).json({
            status: "fail",
            data: {
                message: "This operation references or affects a record that doesn't exist or is still in use",
                constraint: err.constraint
            }
        });
    }

    if (err.code === '23502') {
        return res.status(400).json({
            status: "fail",
            data: {
                message: `The field '${err.column}' is required`,
                constraint: err.constraint
            }
        });
    }

    if (err.code === '22P02') {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Invalid data format was provided"
            }
        });
    }

    return res.status(500).json({
        status: "fail",
        data: {
            message: "Internal server error",
            ...(process.env.NODE_ENV !== 'production' && { debug: err.message })
        }
    });
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = { handleError, asyncHandler };