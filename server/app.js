const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const logger = require('morgan')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const debug = require('debug')("app:" + path.basename(__filename).split('.')[0])
const mongoose = require('mongoose')
const cors = require('cors')

const rootRouter = require('./routes/')

const app = express()

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

require('./config/dbConfig')

const whiteList = ['http://localhost:4200']

const corsOptions = {
  origin: function (origin, callback) {
    const originIsWhitelisted = whiteList.indexOf(origin) !== -1
    callback(null, originIsWhitelisted)
  },
  credentials: true
}

app.use(cors(corsOptions))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}))

require('./passport/serializers');
require('./passport/local');
app.use(passport.initialize());
app.use(passport.session());

app.use('/', rootRouter)

app.all((req, res, next) => {
  res.sendfile(__dirname + '/public/index.html');
});

app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app