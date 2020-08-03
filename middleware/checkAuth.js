let authHelper = require('../helpers/auth')

module.exports = {
  requireLogin: (req, res, next) => {
    console.log('Auth called')
    let userAgent = req.headers['user-agent']

    let token = null

    if ('authorization' in req.headers) {
      token = req.headers.authorization
    } else if ('x-access-token' in req.headers) {
      token = req.headers['x-access-token']
    } else if (req.session && req.session.token) {
      token = req.session.token
    }
    console.log('>>>>>>>>>>> token >>>>>>>>>', token)

    if (userAgent && token) {
      console.log('>>>>>>>>>>> get token nd agent >>>>>>>>>')
      authHelper.jwtToken
        .getTokenData(token)
        .then(decodeData => {
          console.log('==================', decodeData)
          req.decoded = decodeData
          next()
        })
        .catch(decodeErr => {
          console.log(decodeErr)
          res.status(403).json({
            code: 403,
            auth: false,
            error: decodeErr,
            message: 'Invalid - Token | Un-Autherized Access'
          })
        })
    } else {
      console.log('>>>>>>>>>>> not get token nd agent >>>>>>>>>')

      if (req.body && req.method === 'post') {
        res.status(401).json({
          code: 401,
          auth: false,
          message: 'Not Autherized'
        })
      } else {
        res.status(401).json({
          code: 401,
          auth: false,
          message: 'Not Autherized'
        })
      }
    }
  }
}
