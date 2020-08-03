'use strict'
var fs = require('fs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
let Promise = require('bluebird')
const config = require('./config')

module.exports = {
  // token manipulation functions (jwt)
  token: {
    createOnlyToken: (user, header, cb) => {
      let token = jwt.sign(
        {
          user,
          userAgent: header
        },
        config.tokenKey,
        {
          expiresIn: config.tokenTime
        }
      )
      cb(null, token)
    },
    decodeOnlyToken: (token, header, cb) => {
      jwt.verify(token, config.tokenKey, (err, decoded) => {
        if (err) {
          cb(err, null)
        } else {
          if (decoded.user && decoded.userAgent == header) {
            cb(null, decoded.user)
          } else {
            cb(
              {
                err: 'Token is invalid',
                msg: 'Either UserAgent or token not valid'
              },
              null
            )
          }
        }
      })
    }
  },

  jwtToken: {
    getToken: (user, roles) => {
      return new Promise(function (resolve, reject) {
        // sign with RSA SHA256
        var cert = fs.readFileSync(__dirname + '//' + config.PRIVATE_KEY)
        // sign asynchronously
        jwt.sign(
          {
            data: {
              user: user,
              role: roles
            }
          },
          cert,
          {
            algorithm: 'RS256',
            expiresIn: config.tokenTime
          },
          function (err, token) {
            if (err) {
              console.log(err)
              return reject(err)
            }
            return resolve(token)
          }
        )
      })
    },
    getTokenData: newToken => {
      return new Promise(function (resolve, reject) {
        let token

        if (newToken.split(' ').length > 1) {
          token = newToken.split(' ')[1]
        } else {
          return reject('error no auth')
        }
        // sign with RSA SHA256
        var cert = fs.readFileSync(__dirname + '//publicKey.pub') // get public key
        jwt.verify(
          token,
          cert,
          {
            algorithm: 'RS256'
          },
          function (err, decoded) {
            if (err) {
              console.log(err)
              return reject(err)
            }
            return resolve(decoded.data)
          }
        )
      })
    }
  },

  // req.session manipulation functions (express-session)
  session: {
    add: (req, key, value) => {
      req.session[key] = value
    },
    remove: (req, key) => {
      req.session[key] = null
    },
    destroy: (req, cb) => {
      req.session.destroy(err => {
        cb(err, {
          success: true,
          msg: 'Session destroyed'
        })
      })
    }
  }
}
