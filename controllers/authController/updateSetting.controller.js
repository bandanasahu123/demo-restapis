const _ = require('lodash')

let User = require('../../models/user.model')

function updateSetting (user) {
  return new Promise(function (resolve, reject) {
    console.log(user, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    let settingData = {
      allowNewClient: user.allowNewClient,
      disabledBalanceOnAdd: user.disabledBalanceOnAdd,
      disabledBalanceOnEdit: user.disabledBalanceOnEdit
    }
    User.findOneAndUpdate({ _id: user.userId }, { $set: { settings: settingData } }, { new: true }, (err, userData) => {
      console.log(err, userData)
      if (err) {
        console.log('============ retrieveById err ==============', err)
        return reject({
          code: 400,
          message: 'Something went wrong!'
        })
      } else {
        console.log('//////////////////', userData)
        return resolve(userData)
      }
    })
  })
}

module.exports = {
  updateSetting
}
