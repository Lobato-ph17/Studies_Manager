const express = require("express");
const router = express.Router();
const estudoController = require("../controllers/estudoController");

router.get("/ola", estudoController.boasVindas);

router.post("/", estudoController.criarRegistro);

router.get("/", estudoController.listarTodos);

router.get("/estudos/total", estudoController.calcularTotal);

router.delete("/:id", estudoController.deletarRegistro);

router.get("/total", estudoController.getStats);

module.exports = router;
