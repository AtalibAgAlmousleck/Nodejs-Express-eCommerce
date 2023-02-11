const express = require('express');

const authController = require('../controllers/auth.controller');

const router = express.Router();

//! Register New Account
router.get('/signup', authController.getSignup);
router.post('/signup', authController.signup);

//! login methods
router.get('/login', authController.getLogin);
router.post('/login', authController.login);

//! logout
router.post('/logout', authController.logout);

module.exports = router;