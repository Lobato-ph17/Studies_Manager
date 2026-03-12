const express = require('express');
const router = express.Router();
const estudoController = require('../controllers/estudoController');

router.get('/', estudoController.boasVindas);
router.post('/estudos', estudoController.criarRegistro);
router.get('/estudos', estudoController.listarTodos);
router.get('/estudos/total', estudoController.calcularTotal);
router.delete('/estudos/:id', estudoController.deletarRegistro);

module.exports = router; 


