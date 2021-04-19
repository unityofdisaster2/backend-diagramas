require('dotenv').config();

const { response } = require('express');

const net = require('net');


const Grafo = require('../models/graphModel');


/**
 * funcion utilizada para establecer conexion con matlab a traves de sockets de flujo.
 * como las operaciones realizadas desde enviar la informacion hasta recibir una respuesta
 * son asincronas se envuelve la logica en una promesa.
 * @param {*} body objeto JSON recibido desde el request 
 * @returns promesa que retorna la respuesta del servidor en su resolve en caso de haberse
 * establecido la conexion correctamente. en caso contrario se devuelve error de conexion
 */
const tcpConnection = (body) => {
    const tcpPromise = new Promise((resolve, reject) => {
        let cliente = new net.Socket({ writable: true, readable: true });
        cliente.setTimeout(60000);

        // se establece conexion con los valores definidos en el archivo de variables
        // de entorno
        cliente.connect(process.env.MATLAB_PORT, process.env.MATLAB_HOST, () => {
            // envio de objeto al servidor en forma de cadena
            cliente.write(JSON.stringify(body) + '~');

            let cadenaFinal = '';

            /**
             * se agrega listener al cliente para que ejecute una tarea cada que reciba
             * un lote de datos desde el servidor
             */
            cliente.on('data', (data) => {

                // cuando la respuesta del servidor sobrepasa cierto numero de bytes
                // se manda por lotes, por lo tanto cada que llegue un lote se convierte a
                // cadena y se concatena en la variable globalString
                let cadenaDatos = data.toString();
                // se quita el ultimo caracter de la cadena ya que contiene el terminator de
                // del servidor (el caracter que indica fin de cadena)
                if (cadenaDatos.charAt(cadenaDatos.length - 1) === '~') {
                    cadenaFinal += cadenaDatos.replace('~', '');
                } else {
                    cadenaFinal += cadenaDatos;
                }
            });

            // accion realizada cuando se termina la conexion con el servidor
            cliente.on('end', () => {
                try {
                    // en este punto se ha recibido toda la informacion del servidor
                    // asi se que envuelve en el resolve
                    resolve(cadenaFinal);
                } catch (err) {
                    reject('error al finalizar');
                }
                console.log('conexion finalizada');
            });


            cliente.end();

        }).on('error', (err) => {
            // si hubo un error de conexion se rechaza la promesa
            // y se agrega el codigo de error
            reject(err.code);
        });


    });

    return tcpPromise;
}


/**
 * Handler utilizado para el endpoint encargado de devolver todos los registros
 * de la coleccion de grafos
 * @param {*} req 
 * @param {*} res 
 */
const getGraphs = async (req, res = response) => {

    const listaGrafos = await Grafo.find({});
    try {

        res.send(listaGrafos);
    } catch (err) {
        res.status(500).json({
            error: err,
            code: 500,
            mensaje: 'error en el servidor'
        });
    }
}


/**
 * Handler utilizado para el endpoint encargado de crear un registro
 * @param {*} req 
 * @param {*} res 
 */
const createGraph = async (req, res) => {

    const cuerpo = req.body;

    // se convierte el cuerpo del grafo en cadena para evitar
    // problemas con caracteres no soportados por mongo
    cuerpo['grafo'] = JSON.stringify(cuerpo['grafo']);

    const grafo = new Grafo(cuerpo);
    try {
        await grafo.save();
        res.json({
            code: 200,
            message: 'Se ha insertado el grafo en la base de datos'
        })
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'error al insertar el registro'
        });
    }
}



const updateGraph = async (req, res) => {

};


const matlabConnection = async (req, res = response) => {

    try {
        /** 
         * se establece conexion con el servidor matlab y se espera su respuesta
        */
        const matlabResponse = await tcpConnection(req.body);

        res.status(200).json(JSON.parse(matlabResponse));
    } catch (error) {
        res.status(500).json(error);
    }

}

module.exports = {
    getGraphs,
    createGraph,
    updateGraph,
    matlabConnection
}