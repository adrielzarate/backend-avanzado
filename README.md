Nodeapi
=======

## Deploy

Una vez descargado el proyecto, instalamos las dependencias
```
    $ npm install
```

En otra terminal levantamos mongod
```
    $ mongod
```

Para empezar con 2 anuncios y 3 usuarios precargados en la base de datos, hacemos (desde la terminal de la aplicacion)
```
    $ npm run install_db
```

Para activar la generacion de thumbnails asegurate de tener instalado [PM2](http://pm2.keymetrics.io/) y correr el servicio
```
   pm2 start thumbnailService.js
```

## Start

Lanzamos Nodeapi
```
    $ npm run dev
```

La aplicacion corre en [http://localhost:3000](http://localhost:3000)

Puedes ingresar con este usuario
```
    user: user@example.com
    password: 1234
```

El token generado para hacer uso de la API esta configurado para caducar en 60 segundos

## Tests

Los tests programados son 4

* Post a la API para autenticacion
* Get con error 401 si hacemos la peticion sin el token
* Get exitoso a la API cuando hacemos la peticion con el token
* Get con error 401 si hacemos la peticion con el token caducado
```
    $ npm run e2e
```

## Modulo de NPM: npmgram

npmgram esta disponible [aqui](https://www.npmjs.com/package/npmgram)