/**
 * Typically Event handlers of routes should
 * fall inside here as `controllers`
 */

const notesRouter = require('express').Router()
const Note = require('../models/note')

/**
 * Retrieves json object from mongodb
 */
notesRouter.get('/',(request, response) => {
    Note.find({}).then(notes => {
        response.json(notes.map(note => note.toJSON()))
    })
})

/**
 * Retrieve users by id mongodb
 */
notesRouter.get('/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note =>{
            if(note){
                response.json(note.toJSON())
            }else{
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})