'use strict';

const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/Usuario');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    res.locals.errors = '';
    res.render('signin');
  } catch (err) { return next(err); }
});

router.post('/', async function (req, res, next) {

    const data = await Usuario.hashPassword(req.body);
    const usuario = new Usuario(data);

    res.locals.errors = '';

    usuario.save((err) => {
        if(err) {
            res.locals.errors = 'Ya existe un usuario con el correo ingresado';
            res.render('signin');
            // next(err);
            return;
        }
        res.redirect('/login');
    });

});

module.exports = router;
