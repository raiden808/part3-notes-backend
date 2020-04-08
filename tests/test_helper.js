const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
    {
        content: 'HTML is easy',
        important: false,
        date: new Date(),
    },
    {
        content: 'Browser can execute only Javascript',
        important: true,
        date: new Date(),
    }
]

const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon' })
    await note.save()
    await note.remove()

    return note._id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

const usersIndDb = async () => {
    const users = await users.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialNotes, 
    nonExistingId, 
    notesInDb,
    usersIndDb
}