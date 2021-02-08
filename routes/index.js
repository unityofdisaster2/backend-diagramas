var express = require('express');
var router = express.Router();
var net = require('net');

var cliente = new net.Socket({writable: true, readable: true});
cliente.setTimeout(60000);

let globalResponse;
let globalString;

// listener que se activara cuando el socket haga conexion con el servidor
// de matlab. La funcion generada consiste en el conjunto de datos recibidos
// como respuesta posterior al procesamiento que se haya realizado en matlab.
cliente.on('data', (data) => {
  
  // cuando la respuesta del servidor sobrepasa cierto numero de bytes
  // se manda por lotes, por lo tanto cada que llegue un lote se convierte a
  // cadena y se concatena en la variable globalString
  var cadenaDatos = data.toString();
  // se quita el ultimo caracter de la cadena ya que contiene el terminator de
  // del servidor (el caracter que indica fin de cadena)
  console.log('termina con: ', cadenaDatos.charAt(cadenaDatos.length- 1));
  if(cadenaDatos.charAt(cadenaDatos.length- 1) === '~') {
    globalString += cadenaDatos.replace('~','');
    console.log('encontrado terminator');
  } else {
    globalString += cadenaDatos;
  }
  // globalString += cadenaDatos.substring(0, cadenaDatos.length - 1);
  
  // cliente.end();
});

// accion realizada cuando se termina la conexion con el servidor matlab
cliente.on('end', () => {
  try {
    globalResponse.status(200).json(JSON.parse(globalString));
  } catch(err) {
    globalResponse.status(500).send(err);
  }
  
  console.log('conexion finalizada');
});

cliente.on('error', (err) => {
  if(err.code === 'ECONNREFUSED') {
    globalResponse.status(503).send();
  }
  // globalResponse.status(503).send();
});





// modelo que permite interactuar con Mongo
var grafoModel = require('../models/graph');




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// ruta para obtener todos los registros de la base de datos
router.get('/api/registros', async (req, res) => {
  //const personas = await personaModel.find({});
  const modelosGrafos = await grafoModel.find({});
  try{
    
    res.send(modelosGrafos);
  }catch(err){
    res.status(500).send(err);
  }
});

// ruta para insertar un registro a la base de datos por medio de post
router.post('/api/insertGraph', async (req,res) => {
  const cuerpo = req.body;
  
  // se convierte el cuerpo del grafo en cadena para evitar
  // problemas con caracteres no soportados por mongo
  cuerpo['grafo'] = JSON.stringify(cuerpo['grafo']);

  const grafo = new grafoModel(cuerpo);
  try{
    await grafo.save();
    res.send({ code: 'correcto' });
  }catch(err){
    res.status(500).send(err);
  }
});





// ruta para procesar y enviar los datos contenidos en el diagrama y enviarlos
// a matlab para su ejecucion
router.post('/api/tcpMessage',(req, res) => {
  
  globalString = "";
  globalResponse = null;
  // se hace esta igualacion para poder manipular la respuesta en otro contexto del programa
  globalResponse = res;
    cliente.connect(1234, 'localhost', () => {
        cliente.write(JSON.stringify(req.body)+'~');
        cliente.end();

    });

});

module.exports = router;
