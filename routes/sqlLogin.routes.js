const express = require('express');
const router = express.Router();
const User = require('../models/SqlUserModel')

router.post('/', async function (req, res, next) {
    const { username, password, checked } = req.body;
    let user = await User.fetchByUsername(username, password, checked)
    if(user){
        req.session.user = user
        return res.json({ msg: "Uspješna prijava." });
    }
    else{
        return res.json({ msg: 'Netočno korisničko ime ili lozinka.'});
    }
});


module.exports = router;