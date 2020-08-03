const express = require('express')
const router = express.Router()

const { retrieveById, findById } = require('../../controllers/clientController/getClient.controller')
let responseMessage = require('../../helpers/responseHandler')
const _ = require('lodash')

router.post('/', getUsers)

function getUsers (req, res) {
  console.log('getUsers called')
  return retrieveById(req.body)
    .then(function (clientList) {
      console.log('>>>>>>>>>  userList     >>>>>>>>>>>>>', clientList)

      let allData = responseMessage.successResponse(clientList, 200, 'Fetched all users!!')
      return res.json(allData)
    })
    .catch(function (error) {
      console.log('error in post-users-list', error)
      return res.json(responseMessage.errorResponse('', error.code, error.message))
    })
}

module.exports = router
