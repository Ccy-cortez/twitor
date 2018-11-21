// IMPORTS

// HACER QUE EL SW SE ENTERE QUE HAY UN NUEVO ARCHIVO QUE SE PUEDE LLER DESDE AHI
importScripts('js/sw-utils.js'); // este archivo se debe incluir en el app shell 


// 1.- declaracion de las tres variables para el cache
const STATIC_CACHE = 'static-v3';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';




// 2.-  arreglo para el APP_SHELL: esta herramienta se utiliza para especificar todo lo que va a contener la aplicacion
// para ello se debe visualizar el index
// el app shell es como el corazon de la aplicacion, ya que incluye todo lo que el programador hace y lo que deberia de cargar instantaneamente lo mas rapido posible 

// Nota: las librerias de terceros se deben de poner en el cache dinamico o inmutable, ya que son archivos que nosotros no vamos a modificar, es recomendable ponerlo ene l inmutable
// NOTA: en cada uno de estos app shell no deberia de contener algo que no tenga la aplicacion
const APP_SHELL = [
   // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'

];


// 3.- en esta constante de APP_SHELL_INMUTABLE va a contener lo que no se va a modificar jamas
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

// 4.- toca hacer la instalacion del SW

self.addEventListener('install', e => {

    // 5.- debemos almacenar en el cache el APP_SHELL y el APP_SHELL_INMUTABLE, en sus respectivos lugares

    // 6.- comencemos con el cache statico, creando una promesa y abriendo dicho cache
                                                    // .then(cache), para hacer una referencia al cache STATIC
    const cacheStatic = caches.open(  STATIC_CACHE ).then(cache => 
        cache.addAll(APP_SHELL));

    // 7.- Se realiza el mismo paso que el anterior pero con el cache inmutable
                                                    //.then(cahe hace referencia al cache inmutable
    const cacheInmutable = caches.open(  INMUTABLE_CACHE ).then(cache => 
        cache.addAll(APP_SHELL_INMUTABLE));

    
    // 8.- se almacenan las dos variables creadas
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});

// 9.- hacer el proceso de cuando cambie el SW borren los caches que ya no van a servir
self.addEventListener('activate', e => {

    // 10.- verificar si la version del cache actual (la que se encuentra en este SW) es la misma que la que se encuentra activa, entonces no tengo que hacer nada
    // pero si hay alguna diferencia entonces se tiene que borrar el cache statico

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {
            // en este bloque se va a barrer por cada key que tenga
            if( key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        });
    });

    e.waitUntil(respuesta);

});

// SE VA A IMPLEMENTAR LA ESTRATEGIA: CACHE CON NETWORK FALLBACK

// 11.- se debe comenzar implementando un simple cache only
self.addEventListener ('fetch', e => {

    // 12.- verificar si en el cache existe la request
                            // con este then se obtendria la respuesta
   const respuesta = caches.match(e.request).then(res => {

        // 13.- hacer el if para saber si existe la respuesta o no
        if( res ){
            return res;
        } else {
            
            // 14.- implementar el Dynamic cahes osea el network fallback
            // si se llega a este punto del fetch quiere decir que necesitamos un recurso nuevo
            // esto se hace porue en el inmutable static sale error de que no encuentra el elemnto de la fuente, y esto es porque lo direcciona a un url de donde se tiene que descargar por lo tanto este url se debe atrapar en el dinamic
            return fetch ( e.request).then( newRes => {

                // nota: este proceso se almacenaria en el cache dinamico pero creceria mucho el codigo
                //       para evitar eso se creo en la caprpeta app.js el archivo sw-utils.js 
                // 15.- se retorna la respuesta que se obtuvo de la funcion que se encuentra en el sw-utils.js
                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes);
            });
       
        }
       
    });
     // ese evento del Listener debe de responder algo
    e.respondWith(respuesta);
    
});


