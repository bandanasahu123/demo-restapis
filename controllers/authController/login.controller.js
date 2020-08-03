const bcrypt = require('bcryptjs')
const Joi = require('joi')
let _ = require('lodash')
let User = require('../../models/user.model')

function findUser (user) {
  console.log('findUser called')
  return new Promise(function (resolve, reject) {
    User.find(
      {
        $or: [
          {
            username: user.username
          },
          {
            email: user.username
          }
        ]
      },
      (err, userData) => {
        if (err) {
          console.log('Erro while tring to find User', err)
          return reject({
            code: 400,
            message: 'Something went wrong!'
          })
        }
        console.log('===================data================', userData)
        if (userData.length == 0) {
          return reject({
            code: 200,
            message: 'No username found!'
          })
        } else {
          return resolve(userData)
        }
      }
    )
  })
}

module.exports = {
  findUser
}
