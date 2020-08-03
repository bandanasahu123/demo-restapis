const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

const User = require('../../models/user.model')
const JoiValidator = require('../../helpers/JoiValidator')

const sendgrid = require('@sendgrid/mail')
sendgrid.setApiKey('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')

const userSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(20)
    .required(),
  role: Joi.string(),
  email: Joi.string()
    .email()
    .required(),
  mobileNumber: Joi.string()
    .regex(/^[1-9][0-9]{9}$/),
  password: Joi.string()
    .min(3)
    .max(15)
    .required(),
  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .options({ language: { any: { allowOnly: 'must match password' } } })
})

function validateRequest (body) {
  return new Promise(function (resolve, reject) {
    let userDetails = {
      role: body.role,
      email: body.email,
      username: body.username,
      mobileNumber: body.mobileNumber,
      password: body.password,
      confirmPassword: body.confirmPassword
    }

    return JoiValidator.validateJoi(userDetails, userSchema)
      .then(function (isValid) {
        console.log('...................', isValid)
        return resolve(body)
      })
      .catch(function (error) {
        console.log('==================', error)
        return reject({
          code: 400,
          message: 'Validation Error',
          data: error
        })
      })
  })
}

function insert (user, password) {
  console.log(user)
  return new Promise(function (resolve, reject) {
    user = Joi.validate(user, userSchema, {
      abortEarly: false
    })

    if (user.error == null) {
      console.log(user.value)
      let newUser = user.value
      _.set(newUser, 'hashedPassword', password)
      var insertUser = new User(newUser)
      return insertUser
        .save()
        .then(data => {
          return resolve(data)
        })
        .catch(err => {
          console.log('============ insert err ==============', err)
          return reject({
            code: 400,
            message: 'Something went wrong!',
            data: ''
          })
        })
    } else {
      return reject({
        code: 400,
        message: 'Validation error!',
        data: user.error
      })
    }
  })
}

function retrieveByName (user) {
  return new Promise(function (resolve, reject) {
    User.find(
      {
        $or: [
          {
            username: user.username
          },
          {
            email: user.email
          }
        ]
      },
      (err, userData) => {
        if (err) {
          console.log('============ retrieveByName err ==============', err)
          return reject({
            code: 400,
            message: 'Something went wrong!'
          })
        } else {
          console.log('//////////////////', userData)
          if (userData.length == 0) {
            return resolve(userData)
          } else {
            return reject({
              code: 200,
              message: 'Username/Email alredy exist!!'
            })
          }
        }
      }
    )
  })
}

function sendEmail (userData) {
  console.log('send Email called with ', userData)

  return new Promise(function (resolve, reject) {
    // var token = crypto.randomBytes(32).toString('hex')
    userData = JSON.parse(JSON.stringify(userData))
    console.log(userData)

    var info = {}
    info.email = userData.email
    info.expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    var token = jwt.sign(info, config.tokenKey)
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>', token)
    const msg = {
      to: userData.email,
      from: 'vandanasahu@gmail.com',
      subject: 'Your account reset password',
      text: 'and easy to do aywhere, even with Node.js',
      html: `<!DOCTYPE html>
      <html>
      <head>
      </head>
      <body>
          <p>
              Dear ${userData.userName},
              We received a request to reset the password for your account. If you made this request,please click the
              following link in your browser.
          </p>
          <a href="https://d173j5h1xaczob.cloudfront.net/resetPassword/${token}">Reset Password</a>
      </body>
      </html>`
    }
    sendgrid.send(msg, function (err, success) {
      if (err) {
        console.log('============ sendEmail err ==============', err)
        reject({
          code: 400,
          message: 'Error in sending the email!'
        })
      } else {
        console.log('send Email called with ', userData.email)
        User.update(
          {
            email: userData.email,
            userName: userData.userName
          },
          {
            $PUT: {
              passwordToken: token
            }
          },
          (err, data) => {
            if (err) {
              console.log('============ update user err ==============', err)
              return reject({
                code: 400,
                message: 'Something went wrong!'
              })
            }
            // delete data.hashedPassword
            return resolve(data)
          }
        )
      }
    })
  })
}

function sendEmail_new (userData) {
  return new Promise(function (resolve, reject) {
    userData = JSON.parse(JSON.stringify(userData))
    console.log(userData)

    var info = {}
    info.email = userData.email
    info.expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    var token = jwt.sign(info, config.tokenKey)
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>', token)

    emailTemplate
      .sendVerificationEmailThroughSendgrid(userData, token)
      .then(success => {
        User.update(
          { email: userData.email, userName: userData.userName },
          { $PUT: { passwordToken: token } },
          (err, data) => {
            if (err) {
              console.log('============ update user err ==============', err)
              return reject({
                code: 400,
                message: 'Something went wrong!'
              })
            }
            return resolve(data)
          }
        )
      })
      .catch(error => {
        console.log('========= error in sending email ===========', error)
        return reject({ code: 400, message: 'Something went wrong!' })
      })
  })
}

function computeHash (password) {
  return new Promise(function (resolve, reject) {
    // Bytesize
    var len = config1.CRYPTO_BYTE_SIZE
    var iterations = 4096
    var algo = config1.ALGO_IN_USE
    crypto.randomBytes(len, function (err, salt) {
      if (err) return reject(err)
      salt = salt.toString('base64')
      crypto.pbkdf2(password, salt, iterations, len, algo, function (err, derivedKey) {
        if (err) return reject(err)
        resolve({
          salt,
          hash: derivedKey.toString('base64')
        })
      })
    })
  })
}

module.exports = {
  validateRequest,
  insert,
  retrieveByName,
  sendEmail,
  computeHash
}
