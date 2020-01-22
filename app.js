const config       = require('./utils/config')
const express      = require('express')
const bodyParser   = require('body-parser')
const app          = express()
const cors         = require('cors')
const notesRouter  = require('./controllers/notes')
const middleware   = require('./utils/middleware')
const mongoose     = require('mongoose')


console.log('Connecting to', config.MONGODB_URI)

/**
 * Verify connections to MongoDB
 * @param config.MONGODB_URI connection from .env
 * @param useNewUrlParser remove depreceated warning
 */
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

/**
 * Prevent cross origin error
 */
app.use(cors())

/**
 * Use static build file
 */
app.use(express.static('build'))

/**
 * Allows to recieve request.body
 */
app.use(bodyParser.json())

/**
 * Error logger middleware
 */
app.use(middleware.requestLogger)

/**
 * Base url for api
 */
app.use('/api/notes', notesRouter)

/**
 * Unknown endpoint middleware
 */
app.use(middleware.unknownEndpoint)

/**
 * Custom error handling middleware
 */
app.use(middleware.errorHandler)

module.exports = app



