require('dotenv').config()

let PORT        = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

/**
 * Determines mongo url to be used.
 * set up by cross-env package to allow
 * different db for production
 */
if (process.env.NODE_ENV === 'test') {
    MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
    MONGODB_URI,
    PORT
}