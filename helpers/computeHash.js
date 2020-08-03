var crypto = require('crypto')
// var config = require('./config.json')
const bcrypt = require('bcryptjs')
const saltRounds = 10

function computeHash (password) {
  return new Promise(function (resolve, reject) {
    // Bytesize
    var len = config.CRYPTO_BYTE_SIZE
    var iterations = 4096
    var algo = config.ALGO_IN_USE
    crypto.randomBytes(len, function (err, salt) {
      if (err) return reject(err)
      salt = salt.toString('base64')
      crypto.pbkdf2(password, salt, iterations, len, algo, function (err, derivedKey) {
        if (err) return reject(err)
        resolve({
          salt,
          hash: derivedKey.toString('base64')
        })
      })
    })
  })
}

function computeHashWithSalt (password, salt) {
  console.log('================== salt ===============', salt)
  return new Promise(function (resolve, reject) {
    // Bytesize
    var len = config.CRYPTO_BYTE_SIZE
    var iterations = 4096
    var algo = config.ALGO_IN_USE
    return crypto.pbkdf2(password, salt, iterations, len, algo, function (err, derivedKey) {
      console.log('=============== derivedKey ============', derivedKey.toString('base64'))
      if (err) return reject(err)
      else {
        resolve({
          salt,
          hash: derivedKey.toString('base64')
        })
      }
    })
  })
}

function computeBcryptHash (password) {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      if (err) return reject(err)
      else {
        resolve(hash)
      }
    })
  })
}

function compareBcryptHash (password, hash) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, hash, function (err, res) {
      // res == true
      if (err) return reject(err)
      else {
        resolve(res)
      }
    })
  })
}

module.exports = {
  computeHash,
  computeHashWithSalt,
  computeBcryptHash,
  compareBcryptHash
}
