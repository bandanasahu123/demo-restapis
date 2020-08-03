const _ = require('lodash')

let Client = require('../../models/client.model')

function retrieveById (user) {
  console.log('0000000000000000000000000000000000', user)

  if (_.get(user, 'userId')) {
    return new Promise(function (resolve, reject) {
      Client.find(
        {
          userId: user.userId
        },
        (err, clientData) => {
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
        }
      )
    })
  } else {
    return new Promise(function (resolve, reject) {
      Client.findOne(
        {
          _id: user.clientId
        },
        (err, clientData) => {
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
        }
      )
    })
  }
}

function updateBalance (user) {
  return new Promise(function (resolve, reject) {
    console.log(user, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    Client.findOneAndUpdate(
      { _id: user.clientId },
      { $set: { balance: user.balance } },
      { new: true },
      (err, clientData) => {
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
      }
    )
  })
}

module.exports = {
  retrieveById,
  updateBalance
}
