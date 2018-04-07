'use strict';

const i18n = require('i18n');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const autoReload = env === 'development';
const updateFiles = env === 'development';
const syncFiles = env === 'development';

module.exports = function() {
    i18n.configure({
        locales: ['es', 'en'],
        directory: path.join(__dirname, '../locales'),
        defaultLocale: 'es',
        autoReload: autoReload, // recarga locales si tiene cambios
        updateFiles: updateFiles, // crear ficheros de locale inexistentes
        syncFiles: syncFiles, //  sincroniza nuevos literales en todos los locales
        queryParameter: 'lang', // http://localhost:3000/?lang=en
        cookie: 'nodeapi-lang' // usar locale de esta cookie
    });

    i18n.setLocale('es');

    return i18n;

};