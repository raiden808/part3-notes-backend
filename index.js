const express = require('express')
const app = express()
const bodyParser = require('body-parser')

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

app.get('/',(req,res) => {
  res.send('<h1>Hello World!</h1>');
})

/**
 * General view of all notes
 */
app.get('/notes',(req,res)=>{
  res.json(notes)
})

/**
 * Retrieve notes by id
 */
app.get('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

/**
 * Notes deletion request
 */
app.delete('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

/**
 * Generate random ID for note entry
 */
const generateId = () =>{
  const maxId = notes.length > 0
   ? Math.max(...notes.map(n=>n.id))
   : 0

   return maxId + 1;
}

/**
 * Post request
 */
app.use(bodyParser.json())

app.post('/notes', (request, response) => {

  const body = request.body;

  if(!body.content){
    return response.status(400).json({
      error: 'content missing'
    })
  }
  
})

/**
 * Port where server is enabled.
 */
const PORT = 3001
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})