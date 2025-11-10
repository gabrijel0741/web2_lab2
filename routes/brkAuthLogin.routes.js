const express = require('express');
const router = express.Router();
const User = require('../models/AuthUserModel');

router.post('/', async function (req, res, next) {
    const { username, password, checked } = req.body;
    userResult = await User.fetchByUsername(username,password, checked)

    return res.json({msg: userResult})
});


module.exports = router;