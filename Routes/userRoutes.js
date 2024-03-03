const express = require('express');
const userContrl = require('../Controllers/userControllers')
const router = express.Router();

router.post('/login', userContrl.loginController);
router.post('/register', userContrl.registerController);

module.exports = router;