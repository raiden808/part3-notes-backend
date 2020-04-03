const mongoose = require('mongoose')

/**
 * Create user Schema
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    name: String,
    passwordHash: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ],
})

/**
 * Modify returned data
 */
userSchema.set('toJSON',{
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject.id.toString()
        delete returnedObject._id
        delete returnedObject._v
        // password hash should not be revealed
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User