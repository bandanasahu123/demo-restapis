const express = require('express')
const router = express.Router()

const { retrieveByEmail, validateRequest, insertClient, sendEmail } = require('../../controllers/clientController/addClient.controller')
let responseMessage = require('../../helpers/responseHandler')

router.post('/', addClient)

function addClient (req, res) {
  let reqData = req.body
  return validateRequest(reqData)
    .then(isvalid => {
      return retrieveByEmail(reqData)
        .then(data => {
          console.log('insert User Called')

          return insertClient(reqData)
            .then(function (clientData) {
              console.log('inserted User Succcess', clientData)
              return sendEmail(clientData)
                .then(function (user) {
                  let inserData = responseMessage.successResponse({}, 200, 'Client inserted succesfully!')
                  return res.json(inserData)
                })
                .catch(function (error) {
                  console.log('error in post-users-new', error)
                  return res.json(responseMessage.errorResponse('', error.code, error.message))
                })
            })
            .catch(function (error) {
              console.log('error in creating User', error)
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
