const express = require('express');
const router = express.Router();
const User = require('../models/AuthUserModel');

router.post('/', async function (req, res, next) {
    const { username, password, checked } = req.body;
    let user = undefined;
    user = await User.fetchByUsername(username)

    if(checked){
        let errormsg = 'Netočna lozinka'
        if(user && password === user.password){
                req.session.user = user
                return res.json({ msg: "Uspješna prijava" });
        }
        else{
            if(user.user_id === undefined){
                errormsg = 'Netočno korisničko ime.'
            }
            return res.json({ msg: errormsg });
        }
    }
    
});


module.exports = router;