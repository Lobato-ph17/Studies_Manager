import React, {useState} from "react";
import axios from "axios";

function FormularioEstudos(){
    const [materia, setMateria] = useState("");
    const [horas, setHoras] = useState("");
    const [minutos, setMinutos] = useState("");

    const salvarEstudo = async (e) => {
        e.preventDefault();

        const tempoTotal = (Number(horas) * 60) + Number(minutos);

        try {
            await axios.post("http://localhost:5000/estudos",{
                materia: materia,
                tempo: tempoTotal});

            alert("Estudo salvo com sucesso");
            setMateria("");
            setHoras("");
            setMinutos("");
        }catch(error){
            console.error("Erro detalhado:", error.response ? error.response.data : error.message);
            alert("Erro ao salvar o estudo. Verifique o console do VS Code.");
        }
    };

    return (
    <form onSubmit={salvarEstudo} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input
            type="text"
            placeholder="O que você estudou?"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            required
        />
        
        <div style={{ display: 'flex', gap: '5px' }}>
            <input
            type="number"
            placeholder="Horas"
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
            required
            />
            <input
            type="number"
            placeholder="Minutos"
            value={minutos}
            onChange={(e) => setMinutos(e.target.value)}
            required
            />
      </div>
        <button type="submit">Salvar Estudo</button>
    </form>
    );
}

export default FormularioEstudos;