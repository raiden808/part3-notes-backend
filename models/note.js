/**
 * Schema model of the app
 */
const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)


const noteSchema = mongoose.Schema({
    content: {
        type: String,
        minlength: 5,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean
})

/**
 * Modify Schema output
 */
noteSchema.set('toJSON',{
    transform:(document,returnedObject) => {
    /**
         * displays proper id
         */
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id,
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)