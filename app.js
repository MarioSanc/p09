const config = require("./config");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const morgan = require("morgan"); 
const sessionStore = new MySQLStore(config.mysqlConfig);

// Crear un servidor Express.js
const app = express();
// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

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

function middleware_acceso(request, response, next) {
    if (request.session.currentUser != undefined) {
        response.locals.userEmail = request.session.currentUser;
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

app.get("/", function(request, response) {
    response.redirect("/login.html");
    });

    
app.get("/login", function (request, response) {
    response.statusCode = 200;
    response.render("login",{mensaje:null});
});

app.post("/login", function (request, response) {
    response.statusCode = 200;
    daoU.isUserCorrect(request.body.correo, request.body.password, function cb_isUserCorrect(err, result) {
        if (err) {
            response.status(500);
            console.log(err.message);
            response.end(err.message);
        } else if (result) {
            console.log("Usuario y contraseña correctos");
            request.session.currentUser = request.body.correo;
            response.redirect("/tasks");
        } else {
            console.log("Usuario y/o contraseña incorrectos");
            response.render("login",{mensaje: "Dirección de correo y/o contraseña no válidos."});
        }
    });

    //console.log("post login " +request.body.correo);
    //console.log(request.session.currentUser);
});