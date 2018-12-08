"use strict";

const mysql = require("mysql");

class DAOUsers {

    constructor(pool) {

        this.mypool = pool;
    }


    isUserCorrect(email, password, callback) {
        let err_;
        this.mypool.getConnection(function (err, connecction) {

            if (err) {
                err_ = new Error("El pool no logra la conexion");
                callback(err_);
            }
            else {
                connecction.query("select * from usuario where email = ? and password = ?",
                    [email, password], function (err, resultado) {
                        connecction.release();
                        if (err) {
                            err_ = new Error("Fallo en la query " + err);

                            callback(err_);
                        }
                        else {
                            if (resultado.length === 1)
                                callback(null, true);
                            else
                                callback(null, false);
                        }
                    })
            }
        });
    }


    getUserImageName(email, callback) {
        let err_;
        this.mypool.getConnection(function (err, connecction) {
            if (err) {
                err_ = new Error("El pool no logra la conexion");
                callback(err_);
            }
            else {
                connecction.query("select imagen from usuario where email = ?",
                    [email], function (err, resultado) {
                        connecction.release();
                        if (err) {
                            err_ = new Error("Fallo en la query " + err);

                            callback(err_);
                        }
                        else {
                            if (resultado.length === 0) {
                                err_ = new Error("No existe el usuario");

                                callback(err_);
                            } else
                                callback(null, resultado[0].img);
                        }
                    })
            }
        });
    }

    getUser(email, callback) {
        let err_;
        this.mypool.getConnection(function (err, connecction) {
            if (err) {
                err_ = new Error("El pool no logra la conexion");
                callback(err_);
            }
            else {
                connecction.query("select * from usuario where email = ?",
                    [email], function (err, resultado) {
                        connecction.release();
                        if (err) {
                            err_ = new Error("Fallo en la query " + err);

                            callback(err_);
                        }
                        else {
                            if (resultado.length === 0) {
                                err_ = new Error("No existe el usuario ");

                                callback(err_);
                            } else
                                callback(null, resultado[0]);
                        }
                    })
            }
        });
    }

    newUser(datos, callback) {
        this.mypool.getConnection(function (err, connecction) {
            if (err){
                callback(new Error("El pool no logra la conexion" + err));
                return;
            } 
            else {
                connecction.query("insert into usuario(email, password, nombre, genero, fechaNacimiento, imagen) values (?,?,?,?,?,?)",
                    [datos.email, datos.password, datos.nombre, datos.genero, datos.fechaNacimiento, datos.imagen], function (err, resultado) {
                        connecction.release();
                        if (err){
                            callback(err);
                            return;
                        }
                        else {
                            console.log(resultado.insertId);
                            callback(null, resultado.insertId);
                        }
                    });
            }
        });
    }

}

module.exports = DAOUsers;