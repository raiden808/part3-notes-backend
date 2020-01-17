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
app.post('/api/notes',(request, response) =>{
  const body = request.body

  if(body.content == undefined){
    return response.status(400).json({
      error:'content missing'
    })
  }

  /**
   * Create new object for mongodb
   */
  const note = new Note({
    content:body.content,
    important:body.imporant || false,
    date: new Date(),
  })

  /**
   * save to mongodb
   */
  note.save().then(savedNote => {
    response.json(savedNote.toJSON())
  })
})


/**
 * Retrieves json object from mongodb
 */
app.get('/api/notes', (request, response) => {
  Note.find({}).then(note => {
    if(note){
      response.json(note.toJSON())
    }else{
      response.status(404).end()
    }
  })
  /**
   * Pass error to a handler
   * if next is not empty it will move to
   * the next error handling middleware
   */
  .catch(error => next(error))
})

/**
 * Retrieve users by id mongodb
 */
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note =>{
    response.json(note.toJSON())
  })
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
 * Error handling middleware
 */
const errorHandler = (error, request, response, next) =>{
  console.log(error.message)

  if(error.name === 'CastError' && error.kind === 'ObjectId'){
    return response.status(400).send({error: 'malformatted id'})
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