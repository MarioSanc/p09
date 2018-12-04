const config = require("./config");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const morgan = require("morgan");

//daos
const DAOUsers = require("./DAOUsers");

//Session
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
    host: "localhost",
    user: "root",
    password: "",
    database: "facebluff"
});

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

//DAOS
const daoUsuarios = new DAOUsers(pool);
// Crear un servidor Express.js
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34", resave: false, store: sessionStore
});

app.use(middlewareSession);

const ficherosEstaticos = path.join(__dirname, "public");

app.use(express.static(ficherosEstaticos));

app.use(bodyParser.urlencoded({ extended: true }));

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
    daoUsuarios.isUserCorrect(request.body.correo, request.body.password, function cb_isUserCorrect(err, result) {
        if (err) {
            response.status(500);
            console.log(err.message);
            response.end(err.message);
        } else if (result) {
            console.log("Usuario y contraseña correctos");
            request.session.currentUser = request.body.correo;
            response.redirect("/perfil");
        } else {
            console.log("Usuario y/o contraseña incorrectos");
            response.render("login", { mensaje: "Dirección de correo y/o contraseña no válidos." });
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

