"use strict";

/**
 * Modulo que contiene las operaciones necesarias y que afectan a las funcionalidades de gestión de usuario.
 */
class DAOUsers {

    /**
     * Constructor
     * @param {*} pool 
     */
    constructor(pool) {

        this.mypool = pool;
    }

    /**
     * Verifica que exista el usuario con el email y la password recibidos por parámetro.
     * @param {*} email 
     * @param {*} password 
     * @param {*} callback 
     */
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
                                callback(null, true, resultado[0]);
                            else
                                callback(null, false);
                        }
                    })
            }
        });
    }

    /**
     * Devuelve la imagen del usuario con el id recibido por parámetro.
     * @param {*} id 
     * @param {*} callback 
     */
    getUserImageName(id, callback) {
        let err_;
        this.mypool.getConnection(function (err, connecction) {
            if (err) {
                err_ = new Error("El pool no logra la conexion");
                callback(err_);
            }
            else {
                connecction.query("select imagen from usuario where id = ?",
                    [id], function (err, resultado) {
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
                                callback(null, resultado[0].imagen);
                        }
                    })
            }
        });
    }

    /**
     * Devuelve todos los datos del usuario con el id recibido por parámetro.
     * @param {*} id 
     * @param {*} callback 
     */
    getUser(id, callback) {
        let err_;
        this.mypool.getConnection(function (err, connecction) {
            if (err) {
                err_ = new Error("El pool no logra la conexion");
                callback(err_);
            }
            else {
                connecction.query("select * from usuario where id = ?",
                    [id], function (err, resultado) {
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

    /**
     * Inserata un usuario en la BBDD de usuario con los datos recibidos por parámetro.
     * @param {*} datos 
     * @param {*} callback 
     */
    newUser(datos, callback) {
        this.mypool.getConnection(function (err, connecction) {
            if (err) {
                callback(new Error("El pool no logra la conexion" + err));
                return;
            }
            else {
                connecction.query("insert into usuario(email, password, nombre, genero, fechaNacimiento, imagen) values (?,?,?,?,?,?)",
                    [datos.email, datos.password, datos.nombre, datos.genero, datos.fechaNacimiento, datos.imagen], function (err, resultado) {
                        connecction.release();
                        if (err) {
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

    /**
     * Actualiza los datos del usuario con el id recibido por parámetro.
     * @param {*} datos 
     * @param {*} callback 
     */
    updateUser(datos, callback) {
        this.mypool.getConnection(function (err, connecction) {
            if (err) {
                callback(new Error("El pool no logra la conexion" + err));
                return;
            }
            else {
                if (datos.imagen == null) {
                    //Si la imagen nueva es null, no actualiza la imagen.
                    connecction.query("update usuario set email=?, password=?, nombre=?, genero=?, fechaNacimiento=? where id=?",
                        [datos.email, datos.password, datos.nombre, datos.genero, datos.fechaNacimiento, datos.id], function (err, resultado) {
                            connecction.release();
                            if (err) {
                                callback(err);
                                return;
                            }
                            else {
                                console.log(datos.id);
                                callback(null, datos.id);
                            }
                        });
                }
                else {
                    //Si la nueva imagen no es null, se actualiza.
                    connecction.query("update usuario set email=?, password=?, nombre=?, genero=?, fechaNacimiento=?, imagen=? where id=?",
                        [datos.email, datos.password, datos.nombre, datos.genero, datos.fechaNacimiento, datos.imagen, datos.id], function (err, resultado) {
                            connecction.release();
                            if (err) {
                                callback(err);
                                return;
                            }
                            else {
                                console.log(datos.id);
                                callback(null, datos.id);
                            }
                        });
                }
            }
        });
    }

}

module.exports = DAOUsers;