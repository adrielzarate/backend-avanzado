'use strict';

const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/Usuario');
const sessionAuth = require('../lib/sessionAuth');

/* GET home page. */
router.get('/', sessionAuth(), async function(req, res, next) {
    const user = await Usuario.findOne({ _id: req.session.authUser._id });
    res.locals.email = user.email;
    res.locals.token = req.query.token || '';
    res.render('index');
});

module.exports = router;