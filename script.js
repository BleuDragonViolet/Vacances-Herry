// --- Données activités (issues de ton fichier + sources) ---
const activities = [
  {
    key: "usc",
    name: "USC Canoë-Kayak — La Charité-sur-Loire",
    minutes: 10,
    price: "selon formule (sur réservation)",
    url: "https://www.burgundy-tourism.com/sit/usc-canoe-kayak-de-la-charite-2"
  },
  {
    key: "karting",
    name: "Ledoux Karting — Levet",
    minutes: 55,
    price: "1 session 10 min ≈ 17,50 €",
    url: "https://www.ledoux-karting.fr/karting/tarifs-particuliers/"
  },
  {
    key: "geocaching",
    name: "Géocaching",
    minutes: null,
    price: "gratuit (app)",
    url: "https://www.geocaching.com/play"
  },
  {
    key: "pilsac",
    name: "Pêche — Étang de Pilsac (Avord)",
    minutes: 35,
    price: "appâts : asticots ≈ 1,19 €",
    url: "https://www.ville-avord.fr/wp-content/uploads/2025/02/R%C3%A8glement-de-p%C3%AAche-2025.pdf"
  },
  {
    key: "raid",
    name: "Canoë Raid Aventure",
    minutes: null,
    price: "ex. 1/2 journée adulte ≈ 25 €",
    url: "https://www.canoeraidaventure.fr/en/tarifs/"
  }
];

// --- Données pêche ---
// Espèces listées pour l’Étang de Pilsac (commune d’Avord) + estimations ludiques de "chance".
const fishBase = [
  { name: "Gardon", base: 55, family:"blanc" },
  { name: "Brème", base: 45, family:"blanc" },
  { name: "Perche", base: 50, family:"carnassier" },
  { name: "Tanche", base: 35, family:"blanc" },
  { name: "Carpe commune / miroir / cuir", base: 40, family:"carpe" },
  { name: "Carpe amour blanc", base: 20, family:"carpe" },
  { name: "Carpe koï", base: 5, family:"carpe" },
  { name: "Brochet", base: 15, family:"carnassier", openFrom:"04-29" },
  { name: "Sandre", base: 10, family:"carnassier", openFrom:"04-29" },
  { name: "Black-bass", base: 25, family:"carnassier", openFrom:"07-05" }
];

// Multiplicateurs simples selon saison / moment (juste pour le fun).
const seasonFactor = {
  spring: { blanc: 1.0, carpe: 1.1, carnassier: 0.9 },
  summer: { blanc: 1.05, carpe: 1.15, carnassier: 0.85 },
  autumn:{ blanc: 1.0, carpe: 0.95, carnassier: 1.1 }
};
const timeFactor = {
  morning: 1.1,
  day: 0.9,
  evening: 1.15
};

// Vérifie ouverture légale (dates carnassiers d’après règlement 2025).
function isOpenToday(openFrom) {
  if(!openFrom) return true; // espèces "blancs" & carpes : période générale
  const year = new Date().getFullYear();
  const today = new Date();
  const start = new Date(`${year}-${openFrom}`);
  const end = new Date(`${year}-12-31`);
  return today >= start && today <= end;
}

function computePercent(fish, season, moment){
  const fam = fish.family;
  const s = seasonFactor[season][fam] ?? 1;
  const t = timeFactor[moment] ?? 1;
  let p = fish.base * s * t;

  // Si espèce non ouverte légalement aujourd’hui : minime.
  if(!isOpenToday(fish.openFrom)) p = Math.min(p, 3);

  // Clamp 1..95
  p = Math.max(1, Math.min(95, Math.round(p)));
  return p;
}

function renderTable(){
  const container = document.getElementById('fishTable');
  if(!container) return;
  const season = document.getElementById('season').value;
  const moment = document.getElementById('timeofday').value;

  container.innerHTML = '';
  fishBase.forEach(f => {
    const pct = computePercent(f, season, moment);

    const row = document.createElement('div');
    row.className = 'row';

    row.innerHTML = `
      <div class="row-top">
        <div class="fish-name">${f.name}</div>
        <span class="pill">${pct}%</span>
      </div>
      <div class="progress"><div class="bar" style="width:${pct}%"></div></div>
    `;
    container.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  document.getElementById('season').addEventListener('change', renderTable);
  document.getElementById('timeofday').addEventListener('change', renderTable);
});

// === Calcul budget prévisionnel ===
function updateBudget() {
  const trajet = parseFloat(document.getElementById("trajet").value) || 0;
  const nourriture = parseFloat(document.getElementById("nourriture").value) || 0;
  const activites = parseFloat(document.getElementById("activites").value) || 0;

  const total = trajet + nourriture + activites;
  document.getElementById("totalBudget").textContent = total.toFixed(0) + " €";
}

// Écoute les changements dans les champs
document.querySelectorAll("#budget input").forEach(input => {
  input.addEventListener("input", updateBudget);
});

// Initialise au chargement
updateBudget();
