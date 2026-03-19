const express = require("express");
const router = express.Router();
const estudoController = require("../controllers/estudoController");

router.get("/ola", estudoController.boasVindas);

router.post("/", estudoController.criarRegistro);

router.get("/", estudoController.listarTodos);

router.get("/total", estudoController.getStats);

router.delete("/:id", estudoController.deletarRegistro);

module.exports = router;
