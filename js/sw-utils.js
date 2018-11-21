// Este es una archico auxiliar del SW que permite trasladar cierta logica en el SW.js

// 1.- esta funcion se va a encargar de guardar en el cache dinamico
                                // va almacenar el cache dinamico, la request lo que estan solicitando y la res, la respuesta
function actualizaCacheDinamico( dynamicCache, req, res) {

    // 2.- si la respuesta la da, significa que la respuesta tiene data
    
        //3.- y esto se debe de almacenar en el cache
        if(res.ok) {
            
            return caches.open(dynamicCache).then ( cache => {

                // 4.- se debe almacenar el cache la request y clonar la respuesta
                cache.put( req, res.clone());
                // esta funcion debe de regresar algo
                return res.clone;
            });
        }

        // que oasa si no viene nada, nota: no hay mucho que se pueda hacer, poorque ya fallo el cache y fallo la red
        else {
            // se va a regresar lo que sea que regrese la respuesta, puede ser un error de conexion que no pudo encontrar el registro
            return res;
        }


    }
