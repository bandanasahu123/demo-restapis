const express = require('express')
const router = express.Router()

const { deleteClient } = require('../../controllers/clientController/deleteClient.controller')
let responseMessage = require('../../helpers/responseHandler')
const _ = require('lodash')

router.post('/', deleteClients)

function deleteClients (req, res) {
  console.log('deleteUsers called')
  return deleteClient(req.body)
    .then(function (clientList) {
      console.log('>>>>>>>>>  userList     >>>>>>>>>>>>>', clientList)

      let allData = responseMessage.successResponse('', 200, 'Client deleted Successfully!!')
      return res.json(allData)
    })
    .catch(function (error) {
      console.log('error in post-users-list', error)
      return res.json(responseMessage.errorResponse('', error.code, error.message))
    })
}

module.exports = router
