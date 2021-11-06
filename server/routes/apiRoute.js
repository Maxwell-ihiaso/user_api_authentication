const express = require('express');
const { verifyAccessToken } = require('../auth/jwtHelper');
const router = express.Router();
const {
    registerHandler,
    loginHandler } = require('../controllers/apiController');

router.post('/register', registerHandler)
router.post('/login', verifyAccessToken, loginHandler)

module.exports = router;