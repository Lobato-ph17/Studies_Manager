const API_URL = "http://localhost:3000/estudos";

async function carregarEstudos() {
  const res = await fetch(API_URL);
  const resTotal = await fetch(`${API_URL}/total`);

  const estudos = await res.json();
  console.log(estudos);
  const stats = await resTotal.json();

  document.getElementById("totalHoras").innerText = stats.total;

  const lista = document.getElementById("listaEstudos");
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
    lista.innerHTML += `<h3 style="margin-top: 20px; color: var(--primary); border-bottom: 1px solid #334155;">📅 ${data}</h3>`;

    estudosAgrupados[data].forEach((estudo) => {
      lista.innerHTML += `
             <li>
                <div>
                    <strong>${estudo.materia}</strong>
                    <span style="color: #94a3b8; margin-left: 10px;">${estudo.horas}h</span>
                </div>
                <button class = "btn-delete" onclick="deletarEstudo('${estudo._id}')">Excluir</button>
            </li>
        `;
    });
  }
}

async function salvarEstudo() {
  const materiaEl = document.getElementById("materia");
  const horasEl = document.getElementById("horas");

  const materia = materiaEl.value;
  const horas = Number(horasEl.value);

  const data = new Date().toISOString().split("T")[0];

  if (!materia || !horas || horas <= 0) {
    return alert("Preencha todos os campos!!");
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ materia, horas, data }),
  });

  materiaEl.value = "";
  horasEl.value = "";
  carregarEstudos();
}

async function deletarEstudo(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  carregarEstudos();
}

carregarEstudos();
