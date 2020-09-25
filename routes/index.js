var express = require('express');
var router = express.Router();

var personaModel = require('../models/persona'); 


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/registros', async (req, res) => {
  const personas = await personaModel.find({});
  try{
    res.send(personas);
  }catch(err){
    res.status(500).send(err);
  }
});

router.post('/api/persona', async (req,res) => {
  console.log(req.body);
  const persona = new personaModel(req.body);

  try{
    await persona.save();
    res.send(persona);
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
