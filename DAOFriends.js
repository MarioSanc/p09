"use strict";

//he desarrollado este código basándome en el orden de presentación de los datos en el html del guión de la práctica
//Alejandro salgado martin
class DAOFriends {

    constructor(pool) {
        this.pool = pool;
    }

    get_solicitudes_amistad(id_usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, undefined);
            }

            connection.query("SELECT tabla_relacion.id_usuario_A , usuario.nombre FROM `tabla_relacion` join usuario on (tabla_relacion.id_usuario_A = usuario.id) WHERE `id_usuario_B` = ? AND tabla_relacion.estado_relacion = 1 ",
                [id_usuario], function (err, solicitudes) {
                    connection.release();
                    if (err) { callback(err, undefined); }
                    else {
                        callback(err, solicitudes);
                    }
                })
        })
    }

    aceptar_solicitud_amistad(id_usuario, id_futuro_amigo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) { callback(err); }
            else {
                connection.query(
                    "UPDATE tabla_relacion SET estado_relacion=0 WHERE id_usuario_A=? AND id_usuario_B=?",
                    [id_futuro_amigo, id_usuario], function (err) {
                        connection.release();
                        callback(err);
                    }
                );
            }
        });
    }

    rechazar_solicitud_amistad(id_usuario, id_futuro_amigo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) { callback(err); }
            else {
                connection.query(
                    "delete from tabla_relacion WHERE id_usuario_A=? AND id_usuario_B=?",
                    [id_futuro_amigo, id_usuario], function (err) {
                        connection.release();
                        callback(err);
                    }
                );
            }
        });
    }


    get_usuarios_por_nombre(nombre, id_usuario, callback) {
        this.pool.getConnection((err, connection) => {
            let nombre2 = "%" + nombre + "%";
            connection.query(
                "SELECT id, nombre, imagen FROM usuario WHERE nombre LIKE ? and usuario.id != ? and nombre not in (SELECT nombre FROM `tabla_relacion` JOIN usuario ON id_usuario_A = usuario.id or id_usuario_B = usuario.id "+
                "WHERE `id_usuario_A` = ? OR `id_usuario_B` = ?)",
                [nombre2,id_usuario,id_usuario,id_usuario], function (err, usuarios) {
                    connection.release();
                    if (err) { callback(err, undefined);}
                    else {
                        callback(err, usuarios);
                    }
                }
            );
        })
    }


    enviar_solicitud_amistad(id_usuario, id_futuro_amigo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) { callback(err); return; }
            else {
                connection.query("INSERT INTO `tabla_relacion` (`id_usuario_A`, `id_usuario_B`, `estado_relacion`) VALUES (?, ?, 1)",
                    [id_usuario, id_futuro_amigo, id_usuario],
                    function(err)  {
                        connection.release();
                        callback(err);
                    })
            }
        })
    }


    get_amigos(id_usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, undefined);
            }

            connection.query("SELECT * FROM `tabla_relacion` JOIN usuario ON id_usuario_A = usuario.id or id_usuario_B = usuario.id "+
             "WHERE estado_relacion = 0 and (`id_usuario_A` = ? OR `id_usuario_B` = ?) AND usuario.id != ? ",
                [id_usuario,id_usuario,id_usuario], function (err, solicitudes) {
                    connection.release();
                    if (err) { callback(err, undefined); }
                    else {
                        callback(err, solicitudes);
                    }
                })
        })
    }



}

module.exports =  DAOFriends;