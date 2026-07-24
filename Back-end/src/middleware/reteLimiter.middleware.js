const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status: "fail",
        data: {
            message: "You have exceeded the allowed number of requests; please try again later"
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        status: "fail",
        message: "Too many failed login attempts; you have been temporarily blocked for 15 minutes"
    }
})

module.exports = { generalLimiter, authLimiter }