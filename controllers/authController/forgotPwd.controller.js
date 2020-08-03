let User = require('../../models/user.model')

const sendgrid = require('@sendgrid/mail')
sendgrid.setApiKey('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')
const jwt = require('jsonwebtoken')

let config = require('../../helpers/config')
let emailTemplate = require('../../helpers/emailTemplate')

function findUser (user) {
  return new Promise(function (resolve, reject) {
    User.findOne({ email: user.email }, (err, data) => {
      console.log(data)
      if (err) {
        return reject({ code: 400, message: 'Something went wrong!' })
      } else {
        if (!data) {
          return reject({ code: 400, message: 'No data exist in DB!!' })
        } else {
          return resolve(data)
        }
      }
    })
  })
}

function sendEmail (userData) {
  return new Promise(function (resolve, reject) {
    var info = {}
    info.email = userData.email
    info.expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    var token = jwt.sign(info, config.tokenKey)
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>', token)

    return emailTemplate
      .sendVerificationEmailThroughSendgrid(userData, token)
      .then(success => {
        console.log('========== success =============', success[0].statusCode)
        if (success[0].statusCode === 202) {
          User.findOneAndUpdate(
            { email: userData.email, userName: userData.userName },
            { $set: { passwordToken: token, pwdCreatedDate: Date.now() } },
            (err, data) => {
              if (err) {
                console.log('============ error in updating data in DB =============', err)
                return reject({ code: 400, message: 'Something went wrong!' })
              }
              return resolve(success)
            }
          )
        } else {
          return reject({ code: 400, message: 'Mail not sent!' })
        }
      })
      .catch(error => {
        console.log('========= error in sending email ===========', error)
        return reject({ code: 400, message: 'Something went wrong!' })
      })
  })
}

module.exports = {
  findUser,
  sendEmail
}
