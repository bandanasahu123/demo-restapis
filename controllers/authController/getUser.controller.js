const _ = require('lodash')

let User = require('../../models/user.model')

function retrieveById (user) {
  console.log('0000000000000000000000000000000000', user)

  return new Promise(function (resolve, reject) {
    User.findById(user.userId, (err, userData) => {
      if (err) {
        console.log('============ retrieveById err ==============', err)
        return reject({
          code: 400,
          message: 'Something went wrong!'
        })
      } else {
        console.log('//////////////////', userData)
        return resolve(userData)
      }
    })
  })
}

module.exports = {
  retrieveById
}
