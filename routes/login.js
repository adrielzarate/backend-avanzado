'use strict';

const router = require('express').Router();
const fs = require('fs');
const path = require('path');

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        res.render('login');
    } catch (err) {
        return next(err);
    }
});

module.exports = router;