// dependencies
var config = require('./config.json')
var fs = require('fs')

const sendgrid = require('@sendgrid/mail')
sendgrid.setApiKey('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')

function sendVerificationEmailThroughSendgrid (userData, token) {
  var subject = 'Welcome Mail'
  var resetLink = config.RESET_PAGE + '/' + token

  return new Promise(function (resolve, reject) {
    fs.readFile(__dirname + '/templates/reset.html', 'utf8', (err, contents) => {
      if (err) reject(err)
      else {
        // console.log('//////////////////////////////', contents)
        var str = contents.replace('username', userData.firstName)
        // var str1 = str.replace('reset_url', resetLink)
        var str2 = str.replace('2016', new Date().getFullYear())
        // var str2 = str3.replace('username', userData.userName)

        const params = {
          to: userData.email,
          from: config.EMAIL_SOURCE,
          subject: subject,
          html: str2
        }
        // var sendPromise = sendgrid.send(params).promise()

        return sendgrid.send(params)
          .then(function (data) {
            console.log('=============success mail===========')
            // console.log(data.MessageId)
            return resolve(data)
          })
          .catch(function (err) {
            console.error('=========== eror in sending email================', err, err.stack)
            return reject(err)
          })
      }
    })
  })
}

module.exports = {
  sendVerificationEmailThroughSendgrid
}
