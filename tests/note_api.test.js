const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

/**
 * Enables test() to make http request to the backend
 */
const api = supertest(app)

/**
 * Note Schema
 */
const Note = require('../models/note')

const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false,
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true,
    },
]

beforeEach(async () =>{
    /**
     * Clear the database at the beggining
     */
    await Note.deleteMany({})

    /** 
     * Saved initial notes to mongo db
     */
    let noteObject = new Note(initialNotes[0])
    await noteObject.save()

    noteObject = new Note(initialNotes[1])
    await noteObject.save()
})


/**
 * Verify notes returned are the same as
 * initial notes
 */
test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body.length).toBe(initialNotes.length)
})

/**
 * Check if specific note exist in the list of returned notes
 */
test('a specific note is within the returned notes',async () => {
    const reponse = await api.get('/api/notes')

    /**
     * Form array of contents
     */
    const contents = response.body.map(r => r.content)

    /**
     * toContain() - Check if param exist in array.
     */
    expect(contents).toContain(
        'Browser can execute only Javascript'
    )
})

/**
 * Once all test() is done
 */
afterAll(() => {
    mongoose.connection.close()
})