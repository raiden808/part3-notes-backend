const express    = require('express')
const app        = express()
const cors       = require('cors')
const bodyParser = require('body-parser')
const mongoose   = require('mongoose')
require('dotenv').config()

/**
 * Initialize Mongodb
 */
const url =
  `mongodb+srv://fullstack:${process.env.DB_PASS}@cluster0-bczta.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

/**
 * The structure of the database
 */
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note',noteSchema)

/**
 * Modify Schema output of Mongoose
 */
noteSchema.set('toJSON',{
  transform:(document,returnedObject) =>{
    delete returnedObject._id
    delete returnedObject.__v
  }
})

/**
 * Middleware request handler start with this.
 */
app.use(bodyParser.json())

/**
 * Allows request from any origin
 */
app.use(cors())

/**
 * Display detailed info on requests
 */
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

/**
 * Gets static build from react and get backend from express.
 */
app.use(express.static('build'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

/**
 * Insert new notes.
 */
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    /**
     * converts returned array into new
     */
    response.json(notes.map(note => note.toJSON()))
  })
})

/**
 * Retrieve users by id
 */
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

/**
 * Delete users by id
 */
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

/**
 * If endpoint does not exist
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


/**
 * Port assigned to web app
 */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})