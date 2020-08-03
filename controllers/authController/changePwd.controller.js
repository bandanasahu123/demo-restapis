const bcrypt = require('bcryptjs')
const Joi = require('joi')

let User = require('../../models/user.model')
const JoiValidator = require('../../helpers/JoiValidator')
let passwordHash = require('../../helpers/computeHash')
let authHelper = require('../../helpers/auth')

const passwordSchema = Joi.object({
  newPassword: Joi.string()
    .min(3)
    .max(15)
    .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,16}$/)
    .required(),
  confirmPassword: Joi.any()
    .valid(Joi.ref('newPassword'))
    .required()
    .options({
      language: {
        any: {
          allowOnly: 'must match password'
        }
      }
    })
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
        return reject({
          code: 400,
          message: 'Validation Error',
          data: error
        })
      })
  })
}

function findUser (user, token) {
  return new Promise(function (resolve, reject) {
    console.log('find dfsdf================================================', user, token)
    return authHelper.jwtToken
      .getTokenData(token)
      .then(function (tokenData) {
        console.log('tokenData', tokenData)

        return User.findOne(
          {
            email: tokenData.user.email
          },
          (err, data) => {
            if (err) {
              return reject({
                code: 400,
                message: 'Something went wrong!'
              })
            } else {
              console.log('userData', data)
              if (!data) {
                return reject({
                  code: 200,
                  message: 'No data exist in DB!!'
                })
              } else {
                return resolve(data)
              }
            }
          }
        )
      })
      .catch(function (err) {
        return reject({
          code: 200,
          message: err.message
        })
      })

    //  jwt.decode(token, config.tokenKey)
  })
}

function updatePassword (userData, passwordData) {
  console.log('000000000000000000000', userData)
  return new Promise(function (resolve, reject) {
    return passwordHash
      .compareBcryptHash(passwordData.oldPassword, userData.hashedPassword)
      .then(function (chkPwd) {
        if (chkPwd === true) {
          let passwordDetails = {
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword
          }
          passwordDetails = Joi.validate(passwordDetails, passwordSchema, {
            abortEarly: false
          })
          if (passwordDetails.error == null) {
            return passwordHash
              .computeBcryptHash(passwordDetails.value.newPassword)
              .then(function (hashedNewPwd) {
                User.findOneAndUpdate(
                  {
                    email: userData.email
                  },
                  {
                    $set: {
                      hashedPassword: hashedNewPwd
                    }
                  },
                  (err, data) => {
                    if (err) {
                      console.log(err)
                      return reject({
                        code: 400,
                        message: 'Something went wrong!',
                        data: ''
                      })
                    } else {
                      return resolve(data)
                    }
                  }
                )
              })
              .catch(error => {
                console.log(error, '>>>>>>>>>>> error in generating password salt and hash <<<<<<<<<<<<<<<<<<<<<<<<')
                reject({
                  code: 400,
                  message: 'Validation Error',
                  data: error
                })
              })
          } else {
            return reject({
              code: 400,
              message: 'Validation Error',
              data: passwordDetails.error
            })
          }
        } else {
          return reject({
            code: 200,
            message: 'Current password is not matching with DB password!',
            data: ''
          })
        }
      })
      .catch(err => {
        console.log('========== Error in comparing the password =========', err)
        return reject({
          code: 200,
          message: 'Error in comparing the password!',
          data: ''
        })
      })
  })
}

module.exports = {
  validateRequest,
  findUser,
  updatePassword
}
