const express = require('express')
const router = express.Router() // eslint-disable-line new-cap
let checkMiddleware = require('../middleware/checkAuth')

const loginRoute = require('./authRoutes/login.route')
const signupRoute = require('./authRoutes/signup.route')
const forgotPwdRoute = require('./authRoutes/forgotPassword.route')
const resetPwdRoute = require('./authRoutes/resetPassword.route')
const changePwdRoute = require('./authRoutes/changePassword.route')
const getUserRoute = require('./authRoutes/getUser.route')
const addClientRoute = require('./clientRoutes/addClient.route')
const getClientRoute = require('./clientRoutes/getClient.route')
const editClientRoute = require('./clientRoutes/editClient.route')
const updateBalanceRoute = require('./clientRoutes/updateBalance.route')
const updateSettingRoute = require('./authRoutes/updateSetting.route')
const deleteClientRoute = require('./clientRoutes/deleteClient.route')

router.use('/user-login', loginRoute)
router.use('/user-signup', signupRoute)
router.use('/user-forgot-password', forgotPwdRoute)
router.use('/user-reset-password', resetPwdRoute)

router.use(checkMiddleware.requireLogin);

router.use('/user-change-password', changePwdRoute)
router.use('/get-user', getUserRoute)
router.use('/update-setting', updateSettingRoute)

/**
 * CLient Routes ------------------------------------
 */
router.use('/add-client', addClientRoute)
router.use('/get-client', getClientRoute)
router.use('/edit-client', editClientRoute)
router.use('/delete-client', deleteClientRoute)
router.use('/update-balance', updateBalanceRoute)

module.exports = router
