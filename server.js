const express = require("express");

const app = express();

let registrosDeEstudo = [];

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Bem vindo à API do Studies Manager",
    status: "Online",
    version: "1.0.0",
  });
});

app.post("/estudos", (req, res) => {
  const { materia, horas } = req.body;

  if (typeof horas !== "number" || horas <= 0) {
    return res.status(400).json({
      error: "Horas inválidas. Insira um número maior que 0",
    });
  }

  const novoRegistro = {
    id: registrosDeEstudo.length + 1,
    materia,
    horas,
    data: new Date(),
  };

  registrosDeEstudo.push(novoRegistro);

  res.status(201).json(novoRegistro);
});

app.get("/estudos", (req, res) => {
  res.json(registrosDeEstudo);
});

app.get("/estudos/total", (req, res) => {
  let somaHoras = 0;

  registrosDeEstudo.forEach((registro) => {
    somaHoras += registro.horas;
  });

  res.json({
    mensagem: "Cálculo de Horas totais realizado",
    total: somaHoras,
    quantidade_de_sessoes: registrosDeEstudo.length,
  });
});

app.delete('/estudos/:id', (req,res) => {

  const idParaDeletar = Number(req.params.id);

  registrosDeEstudo = registrosDeEstudo.filter(reg => reg.id !== idParaDeletar);

  res.json({
      message: `Registro com ID ${idParaDeletar} removido com sucesso!`,
      total_atual: registrosDeEstudo.length
  })
})

app.listen(3000, () => {
  console.log("Estamos on! Servidor rodando em http://localhost:3000");
});
