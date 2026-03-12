const express = require("express");
const app = express();
const estudoRoutes = require('./src/routes/estudoRoutes');


app.use(express.json());

app.use('/', estudoRoutes);

const PORT = 3000;

const mongoose = require('mongoose');

const dbURI = "mongodb+srv://lobato-ph17:roronoa-op15@lobato-ph17.mw00jnd.mongodb.net/?appName=lobato-ph17";

mongoose.connect(dbURI)
    .then(() => console.log("🔥 Conectado ao MongoDB Atlas com sucesso!"))
    .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err))

app.listen(PORT, () => {
  console.log(`Estamos on! Servidor rodando em http://localhost: ${PORT}`);
});
