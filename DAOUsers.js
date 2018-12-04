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
                            if(resultado.length === 0){
                                err_ = new Error("No existe el usuario");

                                callback(err_);
                            }else
                            callback(null, resultado[0].img);
                        }
                    })
            }
        });
    }

    getUser(email, callback){
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
                            if(resultado.length === 0){
                                err_ = new Error("No existe el usuario ");

                                callback(err_);
                            }else
                            callback(null, resultado[0]);
                        }
                    })
            }
        });
    }


}

module.exports = DAOUsers;