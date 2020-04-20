const bcrypt      = require('bcrypt')
const usersRouter = require('express').Router()
const User        = require('../models/user')

/**
 * Returns list of user to the database
 */
usersRouter.get('/', async (request, response) => {

    /**
     * Populate combines notes schema to users
     * By setting Ref in the user schema
     * Setting to only display content and date
     */
    const users = await User
        .find({}).populate('notes', { content: 1, date: 1 })


    response.json(users.map(u => u.toJSON()))
})

/**
 * Adds a user to the database
 */
usersRouter.post('/', async (request, response) => {
    const body = request.body
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
  
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.json(savedUser)
})

module.exports = usersRouter