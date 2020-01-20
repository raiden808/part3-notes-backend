require('dotenv').config()
const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')
const Note       = require('./models/note')

/**
 * Middleware request handler start with this.
 */
app.use(bodyParser.json())

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
 * Post using mongoddb
 */
app.post('/api/notes',(request, response, next) =>{
  const body = request.body
  /**
   * Create new object for mongodb
   */
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  /**
   * save to mongodb
   */
  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
     })
    .catch(error => next(error))
})

/**
 * Retrieves json object from mongodb
 */
app.get('/api/notes', (request, response,next) => {
   Note.find({}).then(notes => {
    response.json(notes)
  })
})

/**
 * Retrieve users by id mongodb
 */
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
  .then(note => {
    if (note) {
      response.json(note.toJSON())
    } else {
      response.status(204).end()
    }
  })
  /**
   * Pass to error middleware via next function
   */
  .catch(error => next(error))
})

/**
 * Delete users by id
 */
app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

/**
 * Update Specific document
 */
app.put('/api/notes/:id', (request, response, next)=>{
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
  .then(updatedNote => {
    response.json(updatedNote.toJSON())
  })
  .catch(error => next(error))
})


/**
 * If endpoint does not exist
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

/**
 * Error handling middleware
 */
const errorHandler = (error, request, response, next) =>{
  console.log(error.message)

  if(error.name === 'CastError' && error.kind === 'ObjectId'){
    return response.status(400).send({error: 'malformatted id'})
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }
  next(error)
}
app.use(errorHandler)

/**
 * Port assigned to web app
 */
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})