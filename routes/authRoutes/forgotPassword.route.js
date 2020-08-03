const express = require('express')
const router = express.Router()

const { sendEmail,findUser } = require('../../controllers/authController/forgotPwd.controller')

let responseMessage = require('../../helpers/responseHandler')

router.post('/', forgotPassword)

function forgotPassword (req, res) {
  return findUser(req.body)
    .then(userDetails => {
      return sendEmail(userDetails)
        .then(successData => {
          console.log('============= sent =======================')
          let success = responseMessage.successResponse('', 200, 'Mail sent succesfully, Pleas check your mail!!')
          return res.json(success)
        })
        .catch(function (error) {
          console.log('Error in sending email', error)
          return res.json(responseMessage.errorResponse('', error.code, error.message))
        })
    })
    .catch(function (error) {
      console.log('Error in forgot password', error)
      return res.json(responseMessage.errorResponse('', error.code, error.message))
    })
}

module.exports = router
