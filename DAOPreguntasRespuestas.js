

//he desarrollado este código basándome en el orden de presentación de los datos en el html del guión de la práctica
//Alejandro salgado martin

class DAOPreguntasRespuestas {
    constructor(pool) {
        this.pool = pool;
    }


    get_preguntas(callback){
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(err, undefined);
            }
            connection.query("SELECT * FROM tabla_preguntas ORDER BY RAND() LIMIT 5", function (err, questions) {
                    connection.release();
                    if (err) { callback(err, undefined);}
                    else {
                        callback(err, questions);
                    }
                })
        })
    }


    aniadir_pregunta(texto_pregunta, respuestas, callback) {
        this.pool.getConnection(function(err, connection) {
            connection.release();
            if (err) { callback(err); }
          
            connection.query("INSERT INTO tabla_preguntas (`texto_pregunta`)" +
                " VALUES (?)", [texto_pregunta], function (err, resultado) {
                    if (err) { callback(err); }


                    let query = "";
                    for(let i = 0; i <= respuestas.length-1; i++){
                        query = query + ",("+String(resultado.insertId)+","+"'"+String(respuestas[i])+"'"+")";
                    }
                    query = query.substr(1,query.length);
                    query = "INSERT into tabla_respuestas (id_pregunta, texto) VALUES " + query;

                    console.log(query);
                    connection.query(query,function(err){
                        if(err)console.log(err);
                        else{
                            callback(null);
                        }
                    });
                })
        })
    }

    get_info_pregunta(id_pregunta,callback){
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(err, undefined);
            }else
            console.log(id_pregunta);
            connection.query("SELECT * FROM tabla_preguntas join tabla_respuestas on (tabla_respuestas.id_pregunta = tabla_preguntas.id) where tabla_preguntas.id = ?", 
            [id_pregunta],function (err, resultado) {
                    connection.release();
                    if (err) { callback(err);}
                    else {
                        console.log()
                        callback(err,resultado);
                    }
                })
        })
    }


    aniadirRespuestaUsuario(id_usuario, id_respuesta, callback) {
        this.pool.getConnection(function(err, connection)  {
            if (err) { callback(err); }
            connection.query("INSERT INTO tabla_respuestas_usuario VALUES (?, ?)", 
            [id_respuesta, id_usuario],
                function(err)  {
                    connection.release();
                    callback(err);
                })
        })
    }

    aniadir_respuesta_especial(texto,id_pregunta,callback){

        this.pool.getConnection(function(err, connection)  {
            if (err) { callback(err); }
            else

            {
                let respuestas = [texto];
                let query = "";
                for(let i = 0; i <= respuestas.length-1; i++){
                    query = query + ",("+String(id_pregunta)+","+"'"+String(respuestas[i])+"'"+")";
                }
                query = query.substr(1,query.length);
                query = "INSERT into tabla_respuestas (id_pregunta, texto) VALUES " + query;

                console.log(query);
                connection.query(query,function(err,res){
                    if(err)console.log(err);
                    else{
                        callback(res.insertId);
                    }
                });

            }
        
        })
    }



}
module.exports = DAOPreguntasRespuestas;