/**
 * Typically Event handlers of routes should
 * fall inside here as `controllers`
 */
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

/**
 * import token library
 */
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}


/**
 * Retrieves json object from mongodb
 */
notesRouter.get('/', async (request, response) => {
    
    /**
     * Retrieves user schema set by the user reference
     */
    const notes = await Note
        .find({}).populate('user', { username: 1, name: 1 })


    response.json(notes.map(note => note.toJSON()))
})


/**
 * Retrieve users using async
 */
notesRouter.get('/:id', async (request, response, next) => {
    try{
        const note = await Note.findById(request.params.id)
        if (note) {
            response.json(note.toJSON())
        } else {
            response.status(404).end()
        }
    } catch(exception) {
        next(exception)
    }
})

/**
 * Post using MongoDB
 * Using Async
 */
notesRouter.post('/', async (request, response, next) => {
    const body = request.body

    /**
     * Check user id exist in the database
     * and verify token
     */
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    /**
     * New note Object
     */
    const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        date: new Date(),
        user: user._id
    })

    try{
        const savedNote = await note.save()

        /**
         * Saved notes id in the schema
         */
        user.notes = user.notes.concat(savedNote.id)
        await user.save()

        response.json(savedNote.toJSON())
    }catch(exception) {
        /**
         * Important to use next() to pass for the next middleware
         */
        next(exception)
    }
})

/**
 * Delete using MongoDB
 */
notesRouter.delete('/:id', async(request, response, next) => {
    try {
        await Note.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

/**
 * Update specific document in MongoDB
 */
notesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(request.params.id, note , { new : true })
        .then(updatedNote => {
            response.json(updatedNote.toJSON())
        })
        .catch(error => next(error))
})

module.exports = notesRouter