const equipos = {
  "Barcelona SC": "barcelona",
  "Emelec": "emelec",
  "LDU Quito": "ldu",
  "Independiente del Valle": "idv",
  "Aucas": "aucas",
  "El Nacional": "nacional",
  "Delfín": "delfin",
  "Orense": "orense",
  "Cumbayá": "cumbaya",
  "Deportivo Cuenca": "cuenca",
  "Mushuc Runa": "mushuc",
  "Macará": "macara",
  "Técnico Universitario": "tecnico",
  "Libertad FC": "libertad"
};

const select1 = document.getElementById("equipo1");
const select2 = document.getElementById("equipo2");
const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");
const resultado = document.getElementById("resultado");

Object.keys(equipos).forEach(nombre => {
  const option1 = document.createElement("option");
  option1.textContent = nombre;
  option1.value = nombre;

  const option2 = option1.cloneNode(true);

  select1.appendChild(option1);
  select2.appendChild(option2);
});

select1.addEventListener("change", () => {
  if (select1.value === select2.value) {
    alert("No puedes seleccionar el mismo equipo en ambos lados.");
    select1.selectedIndex = 0;
    img1.src = "";
    return;
  }
  img1.src = `assets/${equipos[select1.value]}.png`;
});

select2.addEventListener("change", () => {
  if (select2.value === select1.value) {
    alert("No puedes seleccionar el mismo equipo en ambos lados.");
    select2.selectedIndex = 0;
    img2.src = "";
    return;
  }
  img2.src = `assets/${equipos[select2.value]}.png`;
});

document.getElementById("predecirBtn").addEventListener("click", () => {
  const eq1 = select1.value;
  const eq2 = select2.value;

  if (!eq1 || !eq2 || eq1 === eq2) {
    resultado.textContent = "Selecciona dos equipos distintos.";
    return;
  }

  const ganador = Math.random() > 0.5 ? eq1 : eq2;
  resultado.innerHTML = `<span class="animado">🏆 ¡Ganador probable: ${ganador}!</span>`;
});
