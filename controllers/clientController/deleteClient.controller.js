const _ = require('lodash')

let Client = require('../../models/client.model')

function deleteClient (user) {
  return new Promise(function (resolve, reject) {
    console.log(user, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    Client.findOneAndDelete({ _id: user.clientId }, (err, clientData) => {
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
  deleteClient
}
