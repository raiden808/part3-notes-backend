/**
 * Typically Event handlers of routes should
 * fall inside here as `controllers`
 */
const notesRouter = require('express').Router()
const Note = require('../models/note')

/**
 * Retrieves json object from mongodb
 */
notesRouter.get('/', async (request, response) => {
   const notes = await Note.find({})
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
     * New note Object
     */
    const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        date: new Date()
    })

    
    try{
        const savedNote = await note.save()
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