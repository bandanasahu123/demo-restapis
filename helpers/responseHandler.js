'use strict'
var _ = require('lodash')

function filterError (error) {
  return (
    _.chain(error)
      .get('details')
      .first()
      .get('message')
      .trim()
      .replace(/\"/g, '')
      .value() ||
    error.message ||
    'Error occured please try again later.'
  )
}

module.exports = {
  successResponse: (data, code = 200, message = 'request successfull!!') => {
    return {
      type: 'application/json',
      statusCode: code,
      data: data,
      status: code,
      success: true,
      message: message
    }
  },

  errorResponse: (data = {}, code = 400, message = 'request failed!!') => {
    console.log('================',data)
    return {
      type: 'application/json',
      statusCode: code,
      status: code,
      success: false,
      message: data != '' ? filterError(data) : message,
      data: data || ''
    }
  }
}
