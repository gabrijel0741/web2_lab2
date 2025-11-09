const express = require('express');
const router = express.Router();

router.get('/', async function (req, res, next) {
    res.render('broken', {
        title: req.query.title || 'Loša Autentifikacija (Broken Authentification)',
        result: null
    });
});


module.exports = router;