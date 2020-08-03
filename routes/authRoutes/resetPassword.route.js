const express = require('express')
const router = express.Router()

const { validateRequest, findUser, updatePassword } = require('../../controllers/authController/resetPwd.controller')

let responseMessage = require('../../helpers/responseHandler')

router.post('/', resetPassword)

function resetPassword (req, res) {
  return validateRequest(req.body)
    .then(function (isValid) {
      console.log('validated request', isValid)
      console.log('validated request', req.body)
      return findUser(req.body)
        .then(userDetails => {
          console.log('userDetails', userDetails)
          return updatePassword(userDetails, req.body)
            .then(data => {
              return res.json(responseMessage.successResponse('', 200, 'New password updated succesfully!'))
            })
            .catch(function (err) {
              console.log(err)
              return res.json(responseMessage.errorResponse(err.data, err.code, err.message))
            })
        })
        .catch(error => {
          return res.json(responseMessage.errorResponse('', error.code, error.message))
        })
    })
    .catch(function (error) {
      console.log('Error in reset password', error)
      return res.json(responseMessage.errorResponse(error.data, error.code, error.message))
    })
}

module.exports = router
