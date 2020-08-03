const _ = require('lodash')

let Client = require('../../models/client.model')

function updateClient (user, id) {
  return new Promise(function (resolve, reject) {
    console.log(user, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    Client.findOneAndUpdate({ _id: id }, { $set: { ...user } }, { new: true }, (err, clientData) => {
      console.log(err, clientData)
      if (err) {
        console.log('============ retrieveById err ==============', err)
        return reject({
          code: 400,
          message: 'Something went wrong!'
        })
      } else {
        console.log('//////////////////', clientData)
        return resolve(clientData)
      }
    })
  })
}

module.exports = {
  updateClient
}
