const bcrypt = require('bcryptjs')
const Joi = require('joi')

let User = require('../../models/user.model')
const JoiValidator = require('../../helpers/JoiValidator')
const jwt = require('jsonwebtoken')
let passwordHash = require('../../helpers/computeHash')

let config = require('../../helpers/config')

const passwordSchema = Joi.object({
  newPassword: Joi.string()
    .min(3)
    .max(15)
    .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,16}$/)
    .required(),
  confirmPassword: Joi.any()
    .valid(Joi.ref('newPassword'))
    .required()
    .options({ language: { any: { allowOnly: 'must match password' } } })
})

function validateRequest (body) {
  return new Promise(function (resolve, reject) {
    let passwordDetails = {
      newPassword: body.newPassword,
      confirmPassword: body.confirmPassword
    }
    return JoiValidator.validateJoi(passwordDetails, passwordSchema)
      .then(function (isValid) {
        return resolve(body)
      })
      .catch(function (error) {
        console.log(error)
        return reject({ code: 400, message: 'Validation Error', data: error })
      })
  })
}

function findUser (user) {
  return new Promise(function (resolve, reject) {
    var token = user.passwordToken
    var data = jwt.decode(token, config.tokenKey)
    console.log('/////////////////////////////', data)
    if (new Date(data.expiry) > new Date()) {
      // email: data.email, passwordToken: token
      return User.findOne({ email: data.email, passwordToken: token }, (err, data) => {
        if (err) {
          return reject({ code: 400, message: 'Something went wrong!' })
        } else {
          console.log('data is there')
          if (!data) {
            return reject({ code: 400, message: 'No token is there or Already updated the password' })
          } else {
            return resolve(data)
          }
        }
      })
    } else {
      return reject({ code: 400, message: 'The token is not set, or has expired.' })
    }
  })
}

function updatePassword (userData, passwordData) {
  return new Promise(function (resolve, reject) {
    let passwordDetails = {
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword
    }
    return JoiValidator.validateJoi(passwordDetails, passwordSchema)
      .then(passwordData => {
        console.log('up4')
        console.log(passwordData)

        return passwordHash
          .computeBcryptHash(passwordData.confirmPassword)
          .then(function (hashedNewPwd) {
            console.log('------------------- hashedNewPwd ------------- ', hashedNewPwd)
            User.findOneAndUpdate(
              {
                email: userData.email
              },
              {
                $set: {
                  hashedPassword: hashedNewPwd,
                  passwordToken: null
                }
              },
              (err, data) => {
                if (err) {
                  console.log('error in updating the password', err)
                  return reject({ code: 400, message: 'Something went wrong!' })
                } else {
                  return resolve(data)
                }
              }
            )
          })
          .catch(error => {
            console.log(error, '>>>>>>>>>>> error in generating password salt and hash <<<<<<<<<<<<<<<<<<<<<<<<')
            reject({ code: 400, message: 'Validation Error', data: error })
          })
      })
      .catch(error => {
        reject({ code: 400, message: 'Validation Error', data: error })
      })
  })
}

module.exports = {
  updatePassword,
  findUser,
  validateRequest
}
