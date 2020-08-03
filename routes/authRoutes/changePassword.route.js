const express = require('express')
const router = express.Router()

const { validateRequest, findUser, updatePassword } = require('../../controllers/authController/changePwd.controller')
let responseMessage = require('../../helpers/responseHandler')

router.post('/', changePassword)

function changePassword (req, res) {
  return validateRequest(req.body)
    .then(function (isValid) {
      console.log(req.headers.authorization)
      let userToken = req.headers.authorization
      return findUser(req.body, userToken)
        .then(userDetails => {
          return updatePassword(userDetails, req.body)
            .then(function (userData) {
              let updatedData = responseMessage.successResponse('', 200, 'New password updated succesfully!')
              return res.json(updatedData)
            })
            .catch(function (error) {
              console.log('Error in change password', error)
              return res.json(responseMessage.errorResponse(error.data, error.code, error.message))
            })
        })
        .catch(function (error) {
          console.log('Error in change password', error)
          return res.json(responseMessage.errorResponse('', error.code, error.message))
        })
    })
    .catch(error => {
      console.log('Error in change password', error)
      return res.json(responseMessage.errorResponse(error.data, error.code, error.message))
    })
}

module.exports = router
