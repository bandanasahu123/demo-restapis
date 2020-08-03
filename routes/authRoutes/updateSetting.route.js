const express = require('express')
const router = express.Router()

const { updateSetting } = require('../../controllers/authController/updateSetting.controller')
let responseMessage = require('../../helpers/responseHandler')
const _ = require('lodash')

router.post('/', updateUsers)

function updateUsers (req, res) {
  console.log('getUsers called')
  return updateSetting(req.body)
    .then(function (userList) {
      console.log('>>>>>>>>>  userList     >>>>>>>>>>>>>', userList)

      let allData = responseMessage.successResponse(userList, 200, 'Setting updated successfully')
      return res.json(allData)
    })
    .catch(function (error) {
      console.log('error in post-users-list', error)
      return res.json(responseMessage.errorResponse('', error.code, error.message))
    })
}

module.exports = router
