const express = require('express')
const router = express.Router()
const _ = require('lodash')
const responseMessage = require('../../helpers/responseHandler')
const passwordHash = require('../../helpers/computeHash')
const authHelper = require('../../helpers/auth')
const { findUser } = require('../../controllers/authController/login.controller')

router.post('/', userLogin)

async function userLogin (req, res) {
  console.log('login called')

  const user = {
    username: _.get(req, 'body.username'),
    password: _.get(req, 'body.password')
  }

  console.log(user)
  if (!user.username || !user.password) {
    let err = responseMessage.errorResponse('', 400, 'Please Enter your username and password!!')
    res.json(err)
  } else {
    return findUser(user)
      .then(userData => {
        console.log('============ userData ===============', userData)
        if (userData) {
          if (userData[0].status == 'Active') {
            return passwordHash
              .compareBcryptHash(user.password, userData[0].hashedPassword)
              .then(function (chkPwd) {
                console.log(chkPwd)
                if (chkPwd) {
                  return sentResponse(userData, req, res)
                } else {
                  return res.json(responseMessage.errorResponse('', '200', 'Invalid Credentials...'))
                }
              })
              .catch(error => {
                console.log('============ login error =============', error)
                return res.json(responseMessage.errorResponse('', error.code, error.message))
              })
          } else {
            return res.json(responseMessage.errorResponse('', 200, 'User is not Active!'))
          }
        } else {
          let err = responseMessage.errorResponse('', 200, 'User not found')
          return res.json(err)
        }
      })
      .catch(error => {
        console.log('============ login error =============', error)
        return res.json(responseMessage.errorResponse('', error.code, error.message))
      })
  }
}

async function sentResponse (userData, req, res) {
  console.log('============== sentResponse =-==================', userData)
  userData = userData[0]
  return authHelper.jwtToken
    .getToken(userData, req.headers['User-Agent'])
    .then(function (tokenData) {
      console.log('Token Generated!!', tokenData)
      let userDetails = {
        id: userData._id,
        token: tokenData,
        role: userData.roles,
        userName: userData.username,
        email: userData.email
      }

      let allData = responseMessage.successResponse(userDetails, 200, 'Successful Authentication')
      return res.json(allData)
    })
    .catch(function (tokenErr) {
      let err = responseMessage.errorResponse(tokenErr, 400, 'Some error in token generation')
      return res.json(err)
    })
}

module.exports = router
