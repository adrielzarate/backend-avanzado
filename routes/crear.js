'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../models/Anuncio');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/anuncios/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

router.get('/', (req, res) => {
    // res.render('crear');
});

router.post('/', upload.single('foto-file'), (req, res, next) => {

    const data = req.body;
    data.foto = req.file.filename;
    data.tags = req.body.tags.split(',');
    const anuncio = new Anuncio(data);

    anuncio.save((err) => {
        if(err) {
            next(err);
            return;
        }
        res.redirect('/anuncios');
    });

});

module.exports = router;
