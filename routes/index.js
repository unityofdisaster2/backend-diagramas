var express = require('express');
var router = express.Router();
var net = require('net');

var cliente = new net.Socket({writable: true, readable: true});


let globalResponse;


// listener que se activara cuando el socket haga conexion con el servidor
// de matlab. La funcion generada consiste en el conjunto de datos recibidos
// como respuesta posterior al procesamiento que se haya realizado en matlab.
cliente.on('data', (data) => {
  console.log(data.toString());
  globalResponse.send(data.toString());
  //res.send(true);
  cliente.end();
});

// accion realizada cuando se termina la conexion con el servidor matlab
cliente.on('end', () => {
  console.log('conexion finalizada');
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
    console.log(err, 'hola');
    res.status(500).send(err);
  }
});

router.get('/registros:id', (req, res) => {

});



// ruta para procesar y enviar los datos contenidos en el diagrama y enviarlos
// a matlab para su ejecucion
router.post('/api/tcpMessage',(req, res) => {
  // igualacion para ligar la respuesta con el listener del socket
  globalResponse = res;
  cliente.connect(1234, 'localhost', () => {
    
    cliente.write(JSON.stringify(req.body)+'\t');
    cliente.end();
    
  });
  




});

module.exports = router;
