const express = require('express');
const userContrl = require('../Controllers/userControllers')
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.post('/login', userContrl.loginController);
router.post('/register', userContrl.registerController);
router.get("/fetchUsers", protect, userContrl.fetchAllUsersController);

module.exports = router;