const Joi = require('joi')

module.exports.validateJoi = function (data, schema) {
  return new Promise(function (resolve, reject) {
    Joi.validate(data, schema, {
      abortEarly: false
    })
      .then(res => {
        return resolve(res)
      })
      .catch(function (err) {
        return reject(err)
      })
  })
}


