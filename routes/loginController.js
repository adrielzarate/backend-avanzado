'use strict';

const url = require('url');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController {

    // GET
    index(req, res, next) {
        res.locals.email = process.env.NODE_ENV === 'development' ? 'user@example.com' : '';
        res.locals.errors = '';
        res.render('login');
    }

    // POST
    async post(req, res, next) {
        const email = req.body.email;
        const password = req.body.password;

        res.locals.errors = '';
        res.locals.email = email;

        const user = await Usuario.findOne({ email: email });

        if(!user || !await bcrypt.compare(password, user.password)) {
            res.locals.errors = 'credenciales incorrectas';
            res.render('login');
            return;
        }

        req.session.authUser = { _id: user._id };

        res.redirect('/');
    }

    // POST / loginJWT
    async postLoginJWT(req, res, next) {

        const email = req.body.email;
        const password = req.body.password;
        const user = await Usuario.findOne({ email: email });

        // Compobar usuario encontrado y verificar la clave del usuario
        if(!user || !await bcrypt.compare(password, user.password)) {
            res.json({success: false, error: 'Credenciales incorrectas'});
            return;
        }

        // el usuario esta y cnincide la password
        jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: 1600
        }, (err, token) => {

            if(err) {
                const err = new Error('No se incluyo ningun token');
                err.status = 401;
                next(err);
                return;
            }

            if(err) {
                next(err);
                return;
            }

            if( req.body.home == 'home' ) {
                res.redirect(url.format({
                   pathname:'/',
                   query: {
                      'token': token
                    }
                 }));
            } else {
                res.json({
                    success: true,
                    token: token
                });
            }

        });
    }

    // POST show API from index
    async postJWTAPI(req, res, next) {
        res.redirect(url.format({
           pathname:'/api/anuncios/',
           query: {
              'token': req.body.token
            }
         }));
    }

    // GET /logout
    logout(req, res, next) {
        delete req.session.authUser;
        req.session.regenerate(function(err) {
            if(err) {
                next(err);
                return;
            }
            res.redirect('/');
        });
    }
}

module.exports = new LoginController();
