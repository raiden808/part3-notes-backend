const mongoose = require('mongoose')

/**
 * Hides mongo url
 */
const url = process.env.MONGODB_URI

console.log('connecting to',url)

/**
 * Connection verification
 */
mongoose.connect(url,{useNewUrlParser:true})
    .then(result =>{
        console.log('Connected to MongoDB')
    })
    .catch((error)=>{
        console.log("error connecting to MongoDB", error.message)
    })

/**
 * MongoDB document structure
 */
const noteSchema = mongoose.Schema({
    content:String,
    date:Date,
    important:Boolean,
})

/**
 * Modify Schema output
 */
noteSchema.set('toJSON',{
    transform:(document,returnedObject) =>{
        delete returnedObject._id,
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)