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
 * Retrieve users by id mongodb
 */
notesRouter.get('/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if(note){
                response.json(note.toJSON())
            }else{
                response.status(404).end()
            }
        })
        .catch(error => next(error))
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
notesRouter.delete('/:id',(request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
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