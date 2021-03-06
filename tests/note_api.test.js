const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
/**
 * Enables test() to make http request to the backend
 */
const app = require('../app')
const api = supertest(app)

/**
 * Note Schema
 */
const Note = require('../models/note')

beforeEach(async () => {
    /**
     * Clear the database at the beggining
     */
    await Note.deleteMany({})

    /**
     * Saved initial notes to mongo db
     * Jest excecutes when promise is done.
     */
    const noteObjects = helper.initialNotes
        .map(note => new Note(note))
    const promiseArray = noteObjects.map(note => note.save())
    await Promise.all(promiseArray)
})

describe('when notes there is initially saved notes', () => {
    /**
     * Verify notes returned are the same as
     * initial notes
     */
    test('all notes are returned', async () => {
        const response = await api.get('/api/notes')

        expect(response.body.length).toBe(helper.initialNotes.length)
    })

    /**
     * Check if specific note exist in the list of returned notes
     */
    test('a specific note is within the returned notes',async () => {
        const reponse = await api.get('/api/notes')

        /**
         * Form array of contents
         */
        const contents = reponse.body.map(r => r.content)

        /**
         * toContain() - Check if param exist in array.
         */
        expect(contents).toContain(
            'Browser can execute only Javascript'
        )
    })

    test('a specific note can be viewed', async () => {
        const notesAtStart = await helper.notesInDb()
    
        const noteToView = notesAtStart[0]
    
        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        expect(resultNote.body).toEqual(noteToView)
    })
})


describe('addition of a new notes', () => {
    test('a valid note can be added ', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(200)//201
            .expect('Content-Type', /application\/json/)

        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd.length).toBe(helper.initialNotes.length + 1)

        const contents = notesAtEnd.map(n => n.content)
        expect(contents).toContain(
            'async/await simplifies making async calls'
        )
    })

    test('note without content is not added', async () => {

        const newNote = {
            important: true
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)

        const notesAtEnd = await helper.notesInDb()

        expect(notesAtEnd.length).toBe(helper.initialNotes.length)

    })
})

describe('deletion of a note', () => { 

    test('a note can be deleted', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204)

        const notesAtEnd = await helper.notesInDb()

        expect(notesAtEnd.length).toBe(
            helper.initialNotes.length - 1
        )

        const contents = notesAtEnd.map(r => r.content)

        expect(contents).not.toContain(noteToDelete.content)
    })

})

/**
 * Once all test() is done
 */
afterAll(() => {
    mongoose.connection.close()
})