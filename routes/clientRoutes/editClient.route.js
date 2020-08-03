const express = require('express')
const router = express.Router()

const { updateClient } = require('../../controllers/clientController/editClient.controller')
let responseMessage = require('../../helpers/responseHandler')
const _ = require('lodash')

router.post('/', getUsers)

function getUsers (req, res) {
  console.log('getUsers called')
  let id = req.body.clientId
  delete req.body.clientId
  return updateClient(req.body, id)
    .then(function (clientList) {
      console.log('>>>>>>>>>  userList     >>>>>>>>>>>>>', clientList)

      let allData = responseMessage.successResponse('', 200, 'Client Updated!!')
      return res.json(allData)
    })
    .catch(function (error) {
      console.log('error in post-users-list', error)
      return res.json(responseMessage.errorResponse('', error.code, error.message))
    })
}

module.exports = router
