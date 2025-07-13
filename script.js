const equipos = [
  "Barcelona SC", "Emelec", "LDU Quito", "Independiente del Valle", 
  "Aucas", "El Nacional", "Delfín", "Orense", "Cumbayá", "Deportivo Cuenca", 
  "Mushuc Runa", "Macará", "Técnico Universitario", "Libertad FC"
];

const select1 = document.getElementById("equipo1");
const select2 = document.getElementById("equipo2");
const resultado = document.getElementById("resultado");

// Cargar equipos
equipos.forEach(equipo => {
  const opt1 = document.createElement("option");
  opt1.text = equipo;
  opt1.value = equipo;

  const opt2 = opt1.cloneNode(true);
  
  select1.add(opt1);
  select2.add(opt2);
});

// Predicción falsa (lógica inicial)
document.getElementById("predecirBtn").addEventListener("click", () => {
  const eq1 = select1.value;
  const eq2 = select2.value;

  if (!eq1 || !eq2 || eq1 === eq2) {
    resultado.textContent = "Selecciona dos equipos distintos.";
    return;
  }

  // Simular predicción (puedes cambiarlo por ML o API)
  const ganador = Math.random() > 0.5 ? eq1 : eq2;
  resultado.textContent = `🏆 ¡Ganador probable: ${ganador}!`;
});
