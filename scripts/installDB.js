'use script';

const conn = require('../lib/connectMongoose');
const fs = require('fs');

const Usuario = require('../models/usuario');
const usuarios = JSON.parse(fs.readFileSync(__dirname + '/usuarios.json', 'utf-8'));

const Anuncio = require('../models/Anuncio');
const anuncios = JSON.parse(fs.readFileSync(__dirname + '/anuncios.json', 'utf-8'));

conn.once('open', async () => {
    try {
        await initUsuarios();
        await initAnuncios();
        conn.close();
    } catch(err) {
        console.log('hubo un error:', err);
        process.exit(1);
    }
});

async function initUsuarios() {
    const deleted = await Usuario.deleteMany();
    console.log('Usuarios eliminados.');

    await (async function addUsers() {

        const defaultUsers = [];

        for( const usuario of usuarios['usuarios'] ) {
            await defaultUsers.push( await Usuario.hashPassword(usuario) );
        }

        await Usuario.insertMany(defaultUsers);

    })();

    console.log('Usuarios cargados');
}

async function initAnuncios() {
    const deleted = await Anuncio.deleteMany();
    console.log('Anuncios eliminados.');
    await Anuncio.collection.insert(anuncios);
    console.log('Anuncios cargados');
}