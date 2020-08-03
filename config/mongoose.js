const mongoose = require('mongoose')
const util = require('util')
const debug = require('debug')('express-mongoose-es6-rest-api:index')

const config = require('./config')

// connect to mongo db
const mongoUrl = config.mongo.host
// const mongoUrl = `mongodb://localhost:27017/test`
mongoose
  .connect(
    mongoUrl,
    {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true
    }
  )
  .then(() => console.log('-- MongoDB Connected!! --'))
  .catch(err => {
    console.log(err)
    throw new Error(`unable to connect to database: ${mongoUrl}`)
  })

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc)
  })
}
