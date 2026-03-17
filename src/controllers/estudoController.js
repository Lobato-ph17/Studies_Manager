const Estudo = require("../models/estudo");
const { z } = require("zod");

exports.boasVindas = (req, res) => {
  res.json({
    message: "Bem vindo à API do Studies Manager",
    status: "Online",
    version: "1.0.0",
  });
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

    const deletado = await Estudo.findByIdAndDelete(idParaDeletar);

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
    ]);
    console.log("Estatística Calculadas: ", stats)
    const resultado = stats.length > 0 ? stats[0] : {totalHoras: 0};

    res.json({
      total: resultado.totalHoras,
      ranking: []
    });
  } catch(error){
    console.error(error);
    res.status(500).json({message: "Erro ao calcular horas"})
  }
}

const estudoSchema = z.object({
    materia: z.string().min(2, "A matéria deve ter pelo menos 2 caracteres"),
    minutos: z.number().positive("Os minutos devem ser um número maior do que zero"),
    data: z.string().optional()
});

exports.criarRegistro = async (req,res) => {
    try{
      const dadosValidados = estudoSchema.parse(req.body);

      const hojeInicio = new Date();
      hojeInicio.setHours(0,0,0,0);

      const hojeFim = new Date();
      hojeFim.setHours(23,59,59,999);

      const estudoProcessado = await Estudo.findOneAndUpdate(
        {
          materia: dadosValidados.materia,
          data: {$gte: hojeInicio, $lte: hojeFim}
        },
        {
          $inc: {minutos: dadosValidados.minutos},
          $set: {data: new Date()}
        },
        {
          upsert: true,
          new: true
        }
      );

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






// exports.criarRegistro = async (req, res) => {
//   try {
//     const { materia, horas } = req.body;

//     const novoRegistro = await Estudo.create({
//       materia,
//       horas,
//     });

//     res.status(201).json(novoRegistro);
//   } catch (error) {
//     res.status(400).json({
//       error: "Error ao salvar no MongoDB",
//       detalhes: error.message,
//     });
//   }
// };