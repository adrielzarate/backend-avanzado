'use strict';

const express = require('express');
const router = express.Router();

router.get('/:locale', (req, res, next) => {

    // recuperar lenguaje que me piden
    const locale = req.params.locale;

    // guardarme la pagina a la que volver
    const referer = req.get('referer');

    // establecer una cookie de idioma

    res.cookie('nodeapi-lang', locale, { maxAge:900000, httpOnly: true });

    // redirigir a la pagina donde estaba
    res.redirect(referer);
});

module.exports = router;