'use strict';

const jwt = require('jsonwebtoken');

/**
 * Modulo con funcion que devuelve un middleware.
 * El middleware verifica si el token JWT es valido
 */

module.exports = function() {
    return function(req, res, next) {

        const token = req.body.token || req.query.token || req.get('x-access-token');

        if (!token) {
            const err = new Error('No se incluyo ningun token');
            err.status = 401;
            next(err);
            return;
        }

        // verificamos el token JWT
        jwt.verify(token, process.env.JWT_SECRET, (err, descodificado) => {
            if(err) {
                err = {
                    name: 'TokenExpiredError',
                    message: 'Token expirado'
                }
                err.status = 401;
                next(err);
                return;
            }

            // apuntamos el _id en la peticion para que lo usen los
            // siguientes middlewares
            req.apiUserId = descodificado._id;

            // console.log(descodificado);

            // si el token es valido, por lo tanto dejo continuar
            next();

        });
    };
};