const express = require('express')
const router = express.Router()

const { retrieveById } = require('../../controllers/authController/getUser.controller')
let responseMessage = require('../../helpers/responseHandler')
const _ = require('lodash')

router.post('/', getUsers)

function getUsers (req, res) {
  console.log('getUsers called')
  return retrieveById(req.body)
    .then(function (userList) {
      console.log('>>>>>>>>>  userList     >>>>>>>>>>>>>', userList)

      let allData = responseMessage.successResponse(userList, 200, 'Fetched all users!!')
      return res.json(allData)
    })
    .catch(function (error) {
      console.log('error in post-users-list', error)
      return res.json(responseMessage.errorResponse('', error.code, error.message))
    })
}

module.exports = router
