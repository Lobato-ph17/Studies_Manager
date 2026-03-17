const Estudo = require("../models/estudo");
const { z } = require("zod");

exports.boasVindas = (req, res) => {
  res.json({
    message: "Bem vindo à API do Studies Manager",
    status: "Online",
    version: "1.0.0",
  });
};

exports.criarRegistro = async (req, res) => {
  try {
    const { materia, horas } = req.body;

    const novoRegistro = await Estudo.create({
      materia,
      horas,
    });

    res.status(201).json(novoRegistro);
  } catch (error) {
    res.status(400).json({
      error: "Error ao salvar no MongoDB",
      detalhes: error.message,
    });
  }
};

exports.listarTodos = async (req, res) => {
  try {
    const estudos = await Estudo.find();
    res.json(estudos);
  } catch (error) {
    res.status(500).json({ error: " ao buscar registros no banco" });
  }
};

exports.calcularTotal = async (req, res) => {
  try {
    const estudos = await Estudo.find();
    const somaHoras = estudos.reduce((acc, reg) => acc + reg.horas, 0);
    res.json({
      mensagem: "Calculo realizado com dados do MongoDB",
      total: somaHoras,
      quantidade_de_sessoes: estudos.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao calcular horas" });
  }
};

exports.deletarRegistro = async (req, res) => {
  try {
    const idParaDeletar = req.params.id;

    const deletado = await estudo.findByIdAndDelete(idParaDeletar);

    if (!deletado) {
      return res.status(404).json({ message: "Registro não encontrado!" });
    }
    res.json({
      message: "Registro removido com sucesso",
      id_removido: idParaDeletar,
    });
  } catch (error) {
    res.status(400).json({ message: "ID enviado é inválido " });
  }
};

exports.getStats = async (req,res) => {
  try{
    const stats = await Estudo.aggregate([
      {
        $group: {
          _id: null,
          totalHoras: {$sum: "$horas"},
          materiasMaisEstudadas: { $addToSet: "$materia"}
        }
      }
    ])
    res.json(stats[0] || {totalHoras: 0, materiasMaisEstudadas: []});
  } catch(error){
    res.status(500).json({error: "Erro ao processar as estatísicas"})
  }
}

const estudoSchema = z.object({
    materia: z.string().min(2, "A matéria deve ter pelo menos 2 caracteres"),
    horas: z.number().positive("As horas devem ser um número maior do que zero"),
    data: z.string().optional()
});

exports.criarRegistro = async (req,res) => {
    try{
      const dadosValidados = estudoSchema.parse(req.body);

      const novoEstudo = new Estudo(dadosValidados);
      await novoEstudo.save();
      
      res.status(201).json(novoEstudo);
    } catch(error) {

      if(error instanceof z.ZodError){
        return res.status(400).json({
          mensagem: "Dados Inválidos",
          detalhes: error.erros.map(err => err.message)
        });
      }
      res.status(500).json({error: "Erro Interno"});
    }
}
