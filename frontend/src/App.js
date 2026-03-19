import React from "react";
import FormularioEstudos from "./components/FormularioEstudos";

function App(){
  return(
    <div style={{ padding: "20px" }}>
      <h1>Novo Registro de Estudo</h1>
      <FormularioEstudos />
      <hr />
    </div>
  )
}

export default App;