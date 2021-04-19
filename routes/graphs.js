// en este archivo solo se declaran rutas y se asignan callbacks a cada uno de los recursos
// de la api

const { Router } = require('express');

const router = Router();

const { getGraphs, createGraph, updateGraph, matlabConnection } = require('../controllers/graphsController');


router.get('/', getGraphs);

router.post('/', createGraph);

router.put('/', updateGraph);

router.post('/matlabConnection', matlabConnection);


module.exports = router;

