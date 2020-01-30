const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

/**
 * Enables test() to make http request to the backend
 */
const api = supertest(app)

/**
 * Makes sure proper get response is recieve
 */
test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are four notes', async () => {
    const response = await api.get('/api/notes')

    expect(response.body.length).toBe(4)
})

test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')

    expect(response.body[0].content).toBe('HTML is easy')
})

/**
 * Once all test() is done
 */
afterAll(() => {
    mongoose.connection.close()
})