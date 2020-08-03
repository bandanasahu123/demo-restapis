const express = require('express')
const router = express.Router()
const responseMessage = require('../../helpers/responseHandler')
const passwordHash = require('../../helpers/computeHash')
const { validateRequest, retrieveByName, insert } = require('../../controllers/authController/signup.controller')

router.post('/', userSignup)

function userSignup (req, res) {
  console.log('inserUsers Called')
  let reqData = req.body
  return validateRequest(reqData)
    .then(isvalid => {
      return retrieveByName(reqData)
        .then(data => {
          console.log('insert User Called')
          let newPwd = reqData.confirmPassword
          console.log(newPwd, '===========================================================')

          return passwordHash
            .computeBcryptHash(newPwd)
            .then(function (hash) {
              return insert(reqData, hash)
                .then(function (userData) {
                  console.log('inserted User Succcess', userData)
                  // return sendEmail(userData)
                  //   .then(function (user) {
                  let inserData = responseMessage.successResponse(
                    {},
                    200,
                    'user inserted succesfully!'
                  )
                  return res.json(inserData)
                  // })
                  // .catch(function (error) {
                  //   console.log('error in post-users-new', error)
                  //   return res.json(responseMessage.errorResponse('', error.code, error.message))
                  // })
                })
                .catch(function (error) {
                  console.log('error in creating User', error)
                  return res.json(responseMessage.errorResponse(error.data, error.code, error.message))
                })
            })
            .catch(function (error) {
              console.log('error in ComputeHash User', error)
              return res.json(responseMessage.errorResponse(error.data, error.code, error.message))
            })
        })
        .catch(error => {
          console.log('error in retriving the User', error)
          return res.json(responseMessage.errorResponse('', error.code, error.message))
        })
    })
    .catch(error => {
      console.log('error in validating the User', error)
      return res.json(responseMessage.errorResponse(error.data, error.code, error.message))
    })
}

module.exports = router
