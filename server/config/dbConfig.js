const path = require('path')
const debug = require('debug')('app:'+path.basename(__filename).split('.')[0])
const mongoose = require('mongoose')
const dbURL = process.env.DB_URL || 'mongodb://localhost/ironhack-third-project'

mongoose.connect(dbURL, {})
  .then(() => debug(`Connected to database ${dbURL}`))
  .catch(e => {
    debug(`Error connecting to database ${dbURL}`)
    throw e
  })