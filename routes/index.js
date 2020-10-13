var express = require('express');
var router = express.Router();

var personaModel = require('../models/persona'); 
var grafoModel = require('../models/graph');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/registros', async (req, res) => {
  //const personas = await personaModel.find({});
  const modelosGrafos = await grafoModel.find({});
  try{
    //res.send(personas);
    res.send(modelosGrafos);
  }catch(err){
    res.status(500).send(err);
  }
});

router.post('/api/insertGraph', async (req,res) => {
  
  const grafo = new grafoModel(req.body);
  try{
    await grafo.save();
    res.send({ code: 'correcto' });
  }catch(err){
    
    res.status(500).send(err);
  }
});

router.get('/registros:id', (req, res) => {

});


router.post('/ping', (req, res) => {
  res.send({hola: 'mundo'});
});

module.exports = router;
