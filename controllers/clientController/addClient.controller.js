const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

const Client = require('../../models/client.model')
const JoiValidator = require('../../helpers/JoiValidator')
const config = require('../../helpers/config')
const emailTemplate = require('../../helpers/emailTemplate')

const sendgrid = require('@sendgrid/mail')
sendgrid.setApiKey('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')

const clientSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(20)
    .required(),
  lastName: Joi.string()
    .min(3)
    .max(20)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  mobile: Joi.string().regex(/^[1-9][0-9]{9}$/),
  balance: Joi.string().required(),
  userId: Joi.string().required()
})

function validateRequest (body) {
  return new Promise(function (resolve, reject) {
    let clientDetails = {
      userId: body.userId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      mobile: body.mobile,
      balance: body.balance
    }

    return JoiValidator.validateJoi(clientDetails, clientSchema)
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

function insertClient (client) {
  console.log(client)
  return new Promise(function (resolve, reject) {
    client = Joi.validate(client, clientSchema, {
      abortEarly: false
    })

    if (client.error == null) {
      console.log(client.value)
      let newClient = client.value
      var insertUser = new Client(newClient)
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

function retrieveByEmail (user) {
  return new Promise(function (resolve, reject) {
    Client.find(
      {
        email: user.email
      },
      (err, clientData) => {
        if (err) {
          console.log('============ retrieveByName err ==============', err)
          return reject({
            code: 400,
            message: 'Something went wrong!'
          })
        } else {
          console.log('//////////////////', clientData)
          if (clientData.length == 0) {
            return resolve(clientData)
          } else {
            return reject({
              code: 200,
              message: 'Email alredy exist!!'
            })
          }
        }
      }
    )
  })
}

function sendEmail (clientData) {
  return new Promise(function (resolve, reject) {
    clientData = JSON.parse(JSON.stringify(clientData))
    console.log(clientData)

    var info = {}
    info.email = clientData.email
    info.expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    var token = jwt.sign(info, config.tokenKey)
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>', token)

    emailTemplate
      .sendVerificationEmailThroughSendgrid(clientData, token)
      .then(success => {
        return resolve(success)
      })
      .catch(error => {
        console.log('========= error in sending email ===========', error)
        return reject({ code: 400, message: 'Something went wrong!' })
      })
  })
}

module.exports = {
  validateRequest,
  insertClient,
  retrieveByEmail,
  sendEmail
}
