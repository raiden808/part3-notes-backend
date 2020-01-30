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
/**
 * Once all test() is done
 */
afterAll(() => {
    mongoose.connection.close()
})