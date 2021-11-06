const express = require('express');
const router = express.Router();

router.get('/', require('../controllers/indexController'))

module.exports = router;