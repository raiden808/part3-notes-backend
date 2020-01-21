const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

/**
 * Hides mongo url
 */
const url = process.env.MONGODB_URI

console.log('connecting to',url)

/**
 * Connection verification
 */
mongoose.connect(url,{ useNewUrlParser:true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  })

/**
 * MongoDB document structure
 * can also add restrictions like "required" & "minlength"
 */
const noteSchema = mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  important: Boolean
})

/**
 * Modify Schema output
 */
noteSchema.set('toJSON',{
  transform:(document,returnedObject) => {
    /**
         * displays proper id
         */
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id,
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)