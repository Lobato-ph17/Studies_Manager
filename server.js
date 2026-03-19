const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require("express");
const cors = require ('cors');
const app = express();
const estudoRoutes = require("./src/routes/estudoRoutes");

app.use(express.json());
app.use(cors());

app.use(express.static("public"));
app.use("/estudos", estudoRoutes);


const PORT = 5000;

const mongoose = require("mongoose");

const dbURI =
  "mongodb+srv://lobato-ph17:roronoa-op15@lobato-ph17.mw00jnd.mongodb.net/studies_manager?retryWrites=true&w=majority&appName=lobato-ph17";

mongoose
  .connect(dbURI, {
    tls: true,
    tlsAllowInvalidCertificates: true
  })
  .then(() => console.log("🔥 Conectado ao MongoDB Atlas com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

app.listen(PORT, () => {
  console.log(`Estamos on! Servidor rodando em http://localhost: ${PORT}`);
});

mongoose.connection.on('error', err => {
  console.log('❌ Erro após conexão inicial:', err);
});

mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose conectado ao Atlas!');
});