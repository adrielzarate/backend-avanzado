'use strict';

const cote = require('cote');
var Jimp = require("jimp");

const responder = new cote.Responder({ name: 'thumbnail generator responder' });

responder.on('generateThumbnail', (req, done) => {

    Jimp.read(`${req.routeOrig}${req.name}`).then(function (thumbnail) {
        return thumbnail.resize(100, 100)
             .quality(60)
             .write(`${req.routeDest}sm_${req.name}`);
    }).catch(function (err) {
        console.error(err);
    });

    done('done');

});