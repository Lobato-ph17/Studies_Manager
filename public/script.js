const API_URL = "http://localhost:5000/estudos";

function formatarTempo(minutosTotais) {
  const h = Math.floor(minutosTotais / 60);
  const m = minutosTotais % 60;
  return `${String(h).padStart(2, '0')}: ${String(m).padStart(2, '0')}`;
}

async function carregarEstudos() {
  try{
    const res = await fetch(API_URL);
    const resTotal = await fetch(`${API_URL}/total`);

    const estudos = await res.json();
    if (!Array.isArray(estudos)) {
    console.error("Resposta inesperada:", estudos);
    return;
}
    const stats = await resTotal.json();

    document.getElementById("totalHoras").innerText = formatarTempo(stats.total || 0);

    const lista = document.getElementById("listaEstudos");
    if(!lista) return;

    lista.innerHTML = "";


    const estudosAgrupados = {};

    estudos.forEach((estudo) => {
      const dataFormada = new Date(estudo.data).toLocaleDateString("pt-BR");

      if (!estudosAgrupados[dataFormada]) {
        estudosAgrupados[dataFormada] = [];
      }
      estudosAgrupados[dataFormada].push(estudo);
    });

    for (const data in estudosAgrupados) {
      const totalMinutosDia = estudosAgrupados[data].reduce((acc, est) => acc + (est.minutos || 0), 0);

      lista.innerHTML += 
        `<h3 class="data-group" style="margin-top: 20px; color: var(--primary); border-bottom: 1px solid #334155; display: flex; justify-content: space-between;">
            <span>📅 ${data}</span>
            <span style="font-size: 0.9rem; opacity: 0.7;">Total: ${formatarTempo(totalMinutosDia)}h</span>
        </h3>`;

      estudosAgrupados[data].forEach((estudo) => {

        const tempoIndividual = formatarTempo(estudo.minutos || 0);

        lista.innerHTML += `
              <li>
                  <div>
                      <strong>${estudo.materia}</strong>
                      <span class"horas-tag" style="color: #94a3b8; margin-left: 10px;">${tempoIndividual}h</span>
                  </div>
                  <button class = "btn-delete" onclick="deletarEstudo('${estudo._id}')">Excluir</button>
              </li>
          `;
      });
  }
}catch (error){
  console.error("Erro ao carregar dados: ", error);
}
}

async function salvarEstudo() {
  const materiaEl = document.getElementById("materia");
  const horasEl = document.getElementById("horas");
  const minutosEl = document.getElementById("minutos");

  const materia = materiaEl.value;
  const h = parseInt(horasEl.value) || 0;
  const m = parseInt(minutosEl.value) || 0;

  const minutosTotais = (h * 60) + m;


  if (!materia || minutosTotais <= 0) {
    return alert("Preencha todos os campos!!");
  }


try{
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
         materia: materia,
         tempo: minutosTotais }),
    });

    materiaEl.value = "";
    horasEl.value = "";
    minutosEl.value = "";
    carregarEstudos();
} catch(error){
  alert("Erro ao salvar o estudo");
}
}

async function deletarEstudo(id) {
  const confirmacao = window.confirm("Tem certeza que deseja excluir esse item?")

  if(confirmacao){
    try{
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if(response.ok){
      carregarEstudos();
    } else {
      const error = await response.json();
      alert("Erro ao excluir o estudo" + (erro.message || "Erro Desconhecido"))
    }
    } catch (error){
      console.error("Erro na requisição de delete: ", error)
    }
  }
}

carregarEstudos();
