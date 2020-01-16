const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

/**
 * When writing line in the terminal
 * Do this: node mongo.js <cluster password>
 */
const password = process.argv[2]


/**
 *  give a better name to the database. change the name of the database from the URI:
 *  mongodb+srv://fullstack:${password}@cluster0-bczta.mongodb.net/<Database name>?retryWrites=true&w=majority
 */
const url =
  `mongodb+srv://fullstack:${password}@cluster0-bczta.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

/**
 * The structure of the database
 */
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})
const Note = mongoose.model('Note', noteSchema)

/**
 * Creating an object
 */
const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

/**
 * Saves the object
 */
note.save().then(response => {
  console.log('note saved!')
  mongoose.connection.close()
})