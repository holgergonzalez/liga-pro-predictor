const equipos = {
  "Aucas": "aucas",
  "Barcelona SC": "Barcelona_SC",
  "CD Olmedo": "olmedo",
  "Clan Juvenil": "juvenil",
  "Cuniburo": "cumbi",
  "Delfín SC": "delfin",
  "Deportivo Cuenca": "cuenca",
  "Deportivo Quevedo": "DQ",
  "Deportivo Quito": "Quit",
  "El Nacional": "nacional",
  "Emelec": "emelec",
  "Fuerza Amarilla": "fa",
  "Gualaceo SC": "guala",
  "Guayaquil City FC": "Guayaquil City FC",
  "Imbabura": "Imbabura",
  "Independiente del Valle": "idv",
  "LDU de Quito": "ldu",
  "LDU Loja": "Liga_de_Loja",
  "LDU Portoviejo": "Logo_LDUP_Oficial",
  "Libertad": "libertad",
  "Macará": "macara",
  "Manta FC": "manta",
  "Mushuc Runa SC": "mushuc",
  "Orense SC": "orense",
  "Técnico Universitario": "tecnico",
  "Universidad Catolica": "Ucatólica",
  "9 de Octubre": "9 de Octubre FC",
  "Cumbayá": "cumbaya"
};

const select1 = document.getElementById("equipo1");
const select2 = document.getElementById("equipo2");
const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");
const resultado = document.getElementById("resultado");

// Cargar equipos
Object.keys(equipos).forEach(nombre => {
  const option1 = new Option(nombre, nombre);
  const option2 = new Option(nombre, nombre);
  select1.appendChild(option1);
  select2.appendChild(option2);
});

// Cambiar imagen equipo 1
select1.addEventListener("change", () => {
  if (select1.value === select2.value) {
    alert("No puedes seleccionar el mismo equipo.");
    select1.selectedIndex = 0;
    img1.src = "/static/assets/placeholder.png";
    return;
  }
  img1.src = `/static/assets/${equipos[select1.value]}.png`;
});

// Cambiar imagen equipo 2
select2.addEventListener("change", () => {
  if (select2.value === select1.value) {
    alert("No puedes seleccionar el mismo equipo.");
    select2.selectedIndex = 0;
    img2.src = "/static/assets/placeholder.png";
    return;
  }
  img2.src = `/static/assets/${equipos[select2.value]}.png`;
});

// Botón de predicción
document.getElementById("predecirBtn").addEventListener("click", () => {
  const eq1 = select1.value;
  const eq2 = select2.value;
  const temporada = 2020; // Puedes cambiar esto si usas input de temporada

  if (!eq1 || !eq2 || eq1 === eq2) {
    resultado.textContent = "⚠️ Selecciona dos equipos distintos.";
    return;
  }

  resultado.textContent = "🔄 Calculando...";

  fetch("/predecir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ home_team: eq1, away_team: eq2, season: temporada })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        resultado.textContent = "❌ Error: " + data.error;
        return;
      }

      if (data.resultado_modelo === "D") {
        resultado.innerHTML = `🤝 <strong>Empate detectado</strong> entre ${eq1} y ${eq2}.<br> No se generan estadísticas adicionales.`;
        return;
      }

      const ganador = data.resultado_modelo === "H" ? `${eq1}` : `${eq2}`;

      resultado.innerHTML = `
        <strong>Resultado estimado(GANADOR):</strong> ${ganador}<br>
        <strong>Goles:</strong> ${eq1} ${data.home_goals} - ${data.away_goals} ${eq2}<br>
        <strong>Amarillas:</strong> ${data.yellow_cards}<br>
        <strong>Rojas:</strong> ${data.red_cards}<br>
        <strong>Corners:</strong> ${data.corners}
      `;
    })
    .catch(() => {
      resultado.textContent = "❌ Error al contactar con el servidor.";
    });
});
