const config = require("./config");
const DAOFriends = require("./DAOFriends");
const DAOPreguntasRespuestas = require("./DAOPreguntasRespuestas");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const morgan = require("morgan");
const expressValidator = require('express-validator');
//daos
const DAOUsers = require("./DAOUsers");
//const morgan = require("morgan"); 
//const multer = require("multer");
//const multerFactory = multer();


const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);

// Crear un servidor Express.js
const app = express();

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks
const daoUsuarios = new DAOUsers(pool);
const daoF = new DAOFriends(pool);
const daoPR = new DAOPreguntasRespuestas(pool);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

//morgan es un middleware para mostrar la interaccion del cliente/servidor
//app.use(morgan("dev"));

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34", resave: false, store: sessionStore
});


function flashMiddleware(request, response, next) {
    response.setFlash = function (msg) {
        request.session.flashMsg = msg;
    };
    response.locals.getAndClearFlash = function () {
        let msg = request.session.flashMsg;
        delete request.session.flashMsg;
        return msg;
    };
    next();
};

// La variable ficherosEstaticos guarda el 
// nombre del directorio donde se encuentran 
// los ficheros estáticos: 
// <directorioProyecto>/public 
const ficherosEstaticos = path.join(__dirname, "public");

app.use(middlewareSession);
app.use(express.static(ficherosEstaticos));
/*Los recursos estáticos (imágenes, páginas web estáticas, hojas de estilo) 
suelen almacenarse en una carpeta dentro del servidor. 
Cuando se recibe una petición GET para acceder a alguno de estos recursos estáticos,
se lee el fichero correspondiente y se envía su contenido en la respuesta. 
El middleware static se encarga de todo esto*/
app.use(express.static(ficherosEstaticos));

// Se incluye el middleware body-parser en la cadena de middleware 
/*Este middleware obtiene el cuerpo de la petición HTTP, interpreta su contenido y
modifica el objeto request
añadiéndole un nuevo atributo (llamado body) con la información del formulario.*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(flashMiddleware);

function middleware_acceso(request, response, next) {
    if (request.session.currentUser != undefined) {
        response.locals.userEmail = request.session.currentUser;
        response.locals.currentUserId = request.session.currentUserId;
        next();  // Saltar al siguiente middleware
    } else {
        response.redirect("/login");
    }
}

// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
        //console.log(ficherosEstaticos);
    }
});

app.get("/", function (request, response) {
    response.redirect("/login");
});


app.get("/login", function (request, response) {
    response.statusCode = 200;
    response.render("login", { mensaje: null });
});

app.post("/login", function (request, response) {
    response.statusCode = 200;
    daoUsuarios.isUserCorrect(request.body.correo, request.body.password, function cb_isUserCorrect(err, result, id_usuario) {
        if (err) {
            response.status(500);
            console.log(err.message);
            response.end(err.message);
        } else if (result) {
            console.log("Usuario y contraseña correctos");
            request.session.currentUser = request.body.correo;
            request.session.currentUserId = id_usuario;
            response.redirect("/perfil");
        } else {
            console.log("Usuario y/o contraseña incorrectos");
            response.setFlash("Dirección de correo y/o contraseña no válidos.");
            response.redirect("login");
        }
    });
});

app.get("/perfil", function (request, response) {
    daoUsuarios.getUser(request.session.currentUser, (err, result) => {
        if (err) {
            response.status(500);
            console.log(err.message);
            response.end(err.message);
        }
        else {
            response.render("perfil", { usuario: result });//Hay que pasar la imagen también.
        }
    });
});

app.get("/desconectar", (request, response) => {
    response.status(300);
    request.session.destroy();
    response.redirect("/login");
    response.end();
});

app.get("/registro", (request, response) => {
    response.status(200);
    response.render("registro", { errores: null });
});

app.post("/registro", function (request, response) {
    request.checkBody("nombre", "Nombre de usuario vacío").notEmpty();
    request.checkBody("email", "Dirección de correo no válida").isEmail();

    request.getValidationResult().then(result => {

        if (result.isEmpty()) {

            let datos = new Object();

            datos.email = request.body.email;
            datos.password = request.body.password;
            datos.nombre = request.body.nombre;
            datos.genero = request.body.genero;
            datos.fechaNacimiento = request.body.fechaNacimiento;
            datos.imagen = request.body.imagen;

            daoUsuarios.newUser(datos, (error, res) => {
                if (error) {
                    if (error.errno === 1062) {
                        response.setFlash("El email introducido ya está en uso.");
                        response.redirect("registro");
                    } else console.log(error.message);
                    response.end();
                }
                else {
                    response.redirect("login");
                    response.end();
                }
            });
        } else {
            console.log(result.length);
            response.render("registro", { errores: result.mapped() });
            response.end();
        }
    });

});

app.get("/friends", middleware_acceso, function (request, response) {
    response.statusCode = 200;
    daoF.get_amigos(request.session.currentUserId, function (err, _lista_amigos) {
        if (err) {
            console.error("1" + err);
        } else {


            daoF.get_solicitudes_amistad(request.session.currentUserId, function (err, lista_solicitudes_amistad) {
                if (err) {
                    console.error("2" + err);
                } else {
                    console.log(_lista_amigos);
                    response.render("friends", {
                        lista_solicitudes: lista_solicitudes_amistad,
                        lista_amigos: _lista_amigos
                    });
                }
            });

        }
    });
});

app.post("/aceptarSolicitudAmistad", middleware_acceso, function (request, response) {
    response.statusCode = 200;

    console.log(request.body.id_amigo);
    daoF.aceptar_solicitud_amistad(request.session.currentUserId, request.body.id_amigo,
        function (err) {
            if (err) { console.error(err); }
            else {
                response.status(300);
                response.redirect("/friends");
            }
        })
});

app.post("/rechazarSolicitudAmistad", middleware_acceso, function (request, response) {
    response.statusCode = 200;

    //console.log(request.body.id_amigo);
    daoF.rechazar_solicitud_amistad(request.session.currentUserId, request.body.id_amigo,
        function (err) {
            if (err) { console.error(err); }
            else {
                response.status(300);
                response.redirect("/friends");
            }
        })
});

app.post("/enviarSolicitudAmistad", middleware_acceso, function (request, response) {
    response.statusCode = 200;

    //console.log(request.body.id_amigo);
    daoF.enviar_solicitud_amistad(request.session.currentUserId, request.body.id_amigo,
        function (err) {
            if (err) { console.error(err); }
            else {
                response.status(300);
                response.redirect("/friends");
            }
        })
});



app.get("/buscarNombre", middleware_acceso, function (request, response) {
    response.statusCode = 200;
    daoF.get_usuarios_por_nombre(request.query.nombre, request.session.currentUserId, function cb(err, usuarios) {

        if (err) console.log(err);
        else {
            response.render("busqueda", { lista_resultados: usuarios });
        }

    });
});

app.get("/preguntas", middleware_acceso, function (request, response) {
    response.statusCode = 200;

    daoPR.get_preguntas(function cb(err, preguntas) {

        if (err) console.log(err);
        else {
            response.render("preguntas", { lista_preguntas: preguntas })
        }

    });
});

app.get("/nuevaPregunta", middleware_acceso, function (request, response) {
    response.statusCode = 200;
    response.render("aniadePregunta");
});


app.post("/nuevaPregunta", middleware_acceso, function (request, response) {
    response.statusCode = 200;

    let allAnswers = request.body.respuestas;
    let answer = allAnswers.split("\n");

    // console.log(request.body.la_pregunta);
    daoPR.aniadir_pregunta(request.body.la_pregunta, answer, function cd(err) {
        if (err) console.log(err);
        else {
            response.redirect("preguntas");
        }
    });

});


app.get("/desarrollo_pregunta", middleware_acceso, function (request, response) {
    response.statusCode = 200;

    daoPR.get_info_pregunta(request.query.id_pregunta, function cb(err, resultado) {
        if (err) console.log(err);
        else {

            console.log(resultado);
            let arrayRespuestas = new Array();
            resultado.forEach(tupla => {

                let text = tupla.texto;
                let _id = tupla.id;
                let una_respuesta = { text, _id };
                arrayRespuestas.push(una_respuesta)

            });

            console.log(resultado);
            let _titulo = { titulo: resultado[0].texto_pregunta, id: resultado[0].id_pregunta };
            //console.log(arrayRespuestas);
            response.render("desarrolloPregunta", { lista_respuestas: arrayRespuestas, titulo: _titulo })
        }

    });
});


app.post("/responder", middleware_acceso, function (request, response) {
    response.statusCode = 200;

    if (request.body.respuestaID == -1) {

        //  console.log(request.body.respuesta_especial_texto);
        //  console.log(request.body.id_pregunta);

        daoPR.aniadir_respuesta_especial(request.body.respuesta_especial_texto, request.body.id_pregunta, function cb(insertedID) {

            // console.log(insertedID);

            daoPR.aniadirRespuestaUsuario(request.session.currentUserId, insertedID,
                function (err) {
                    if (err) { console.error(err); }
                    else {
                        console.log("Respondido");
                        response.status(300);
                        response.redirect("/preguntas");
                        response.end();
                    }
                })
        })

    } else {




        daoPR.aniadirRespuestaUsuario(request.session.currentUserId, request.body.respuestaID, function (err) {
            if (err) { console.error(err); }
            else {
                console.log("Respondido");
                response.status(300);
                response.redirect("/preguntas");
                response.end();
            }
        })
    }

});






