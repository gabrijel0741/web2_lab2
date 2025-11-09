const express = require('express');
const router = express.Router();

router.get('/', async function (req, res, next) {
    res.render('home', {
        title: req.query.title || 'SQL ubacivanje (SQL Injection)',
        result: null
    });
});


module.exports = router;