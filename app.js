'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const jwtAuth = require('./lib/jwtAuth');

/* jshint ignore:start */
const db = require('./lib/connectMongoose');

require('./models/Anuncio');

const Usuario = require('./models/Usuario');

// Cargamos las definiciones de todos nuestros modelos

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const i18n = require('./lib/i18nConfigure')();
app.use(i18n.init);

// Global Template variables
app.locals.title = 'NodePop';

const loginController = require('./routes/loginController');

// API v1
app.use('/api/anuncios', jwtAuth(), require('./routes/api/anuncios'));
app.use('/api/authenticate', loginController.postLoginJWT);
app.use('/api/anuncios', loginController.postJWTAPI);
app.use('/crear', require('./routes/crear'));

app.use(session({
    name: 'nodeapi-session',
    secret: 'asdfghjklqwertyuiopzxcvbnm',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
    store: new MongoStore({ url: 'mongodb://localhost/backend_av' })
}));

app.use(async (req, res, next) => {
    app.locals.currentLang = req.cookies['nodeapi-lang'];
    try {
        req.user = req.session.authUser ? await Usuario.findById(req.session.authUser._id) : null;
        next();
    } catch(err) {
        next(err);
        return;
    }
});

app.get('/login', loginController.index);
app.post('/login', loginController.post);
app.get('/logout', loginController.logout);

// Web
app.use('/', require('./routes/index'));
app.use('/anuncios', require('./routes/anuncios'));
app.use('/login', require('./routes/login'));
app.use('/signin', require('./routes/signin'));

app.use('/lang',  require('./routes/lang'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {

    if (err.array) { // validation error
        err.status = 422;
        const errInfo = err.array({ onlyFirstError: true })[0];
        err.message = isAPI(req) ? { message: 'not valid', errors: err.mapped() } :
            `not valid - ${errInfo.param} ${errInfo.msg}`;
    }

    // establezco el status a la respuesta
    err.status = err.status || 500;
    res.status(err.status);

    // si es un 500 lo pinto en el log
    if (err.status && err.status >= 500) console.error(err);

    // si es una petición al API respondo JSON...
    if (isAPI(req)) {
        res.json({ success: false, error: err.message });
        return;
    }

    // ...y si no respondo con HTML...

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.render('error');
});

function isAPI(req) {
    return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;