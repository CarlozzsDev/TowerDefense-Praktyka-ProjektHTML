import { MapaGry } from "./tekstury.js";
import { pobierzWyniki } from "./storage.js";

const KOLORY_ZASTEPCZE = {
  0: "#3a7d44", // trawa
  1: "#c2b280", // ścieżka
  2: "#6c757d", // miejsce na wieżyczkę
  3: "#2b9348", // start
  4: "#d90429"  // baza
};

const canvas = document.getElementById("plansza");
const ctx = canvas.getContext("2d");

const mapa = new MapaGry();
let najechanyKafelek = null;
let animationFrameId = null;

// Przełączanie widocznych ekranów
function pokazEkran(idEkranu) {
  document.querySelectorAll(".ekran").forEach(ekran => {
    ekran.classList.add("ukryty");
  });
  document.getElementById(idEkranu).classList.remove("ukryty");
}

// Odświeżanie tabeli wyników z localStorage
function odswiezTabeleWynikow() {
  const tbody = document.getElementById("lista-wynikow");
  const wyniki = pobierzWyniki();
  tbody.innerHTML = "";

  if (wyniki.length === 0) {
    tbody.innerHTML = "<tr><td colspan='3'>Brak zapisanych wyników</td></tr>";
    return;
  }

  wyniki.forEach(wpis => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${wpis.gracz}</td><td>${wpis.mapa}</td><td>${wpis.wynik}</td>`;
    tbody.appendChild(tr);
  });
}

// Dopasowanie rozmiaru Canvasu do wczytanej mapy
function dopasujCanvasDoMapy(mapaObj) {
  const rozmiarKafelka = mapaObj.RozmiarMap;
  canvas.width = mapaObj.grid[0].length * rozmiarKafelka;
  canvas.height = mapaObj.grid.length * rozmiarKafelka;
}

// Rysowanie mapy na Canvasie
function rysujMape(mapaObj) {
  const size = mapaObj.RozmiarMap;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < mapaObj.grid.length; y++) {
    for (let x = 0; x < mapaObj.grid[y].length; x++) {
      const typ = mapaObj.grid[y][x];
      const texSrc = mapaObj.textureGrid[y][x];
      const img = texSrc ? mapaObj.loadedImages[texSrc] : null;

      if (img) {
        ctx.drawImage(img, x * size, y * size, size, size);
      } else {
        ctx.fillStyle = KOLORY_ZASTEPCZE[typ] || "#000";
        ctx.fillRect(x * size, y * size, size, size);
      }

      // Podświetlenie pola budowy po najechaniu myszką
      if (
        najechanyKafelek &&
        najechanyKafelek.x === x &&
        najechanyKafelek.y === y &&
        typ === 2
      ) {
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 3;
        ctx.strokeRect(x * size + 1.5, y * size + 1.5, size - 3, size - 3);
      }
    }
  }
}

// Główna pętla renderująca
function petlaGry() {
  rysujMape(mapa);
  animationFrameId = requestAnimationFrame(petlaGry);
}

// Wczytanie i start wybranej mapy
async function uruchomMape(sciezkaMapy) {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  await mapa.load(sciezkaMapy);
  dopasujCanvasDoMapy(mapa);
  pokazEkran("ekran-gra");
  petlaGry();
}

// Obsługa myszy na Canvasie
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  najechanyKafelek = mapa.getTileAt(mouseX, mouseY);
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const tile = mapa.getTileAt(e.clientX - rect.left, e.clientY - rect.top);
  if (tile && tile.type === 2) {
    console.log(`Kliknięto slot na wieżyczkę na pozycji X:${tile.x}, Y:${tile.y}`);
  }
});

// Obsługa przycisków menu
document.getElementById("btn-wybor-mapy").addEventListener("click", () => {
  pokazEkran("ekran-wybor-mapy");
});

document.getElementById("btn-tabela-wynikow").addEventListener("click", () => {
  odswiezTabeleWynikow();
  pokazEkran("ekran-wyniki");
});

document.getElementById("btn-instrukcja").addEventListener("click", () => {
  pokazEkran("ekran-instrukcja");
});

document.querySelectorAll(".btn-powrot").forEach(btn => {
  btn.addEventListener("click", () => pokazEkran("ekran-menu"));
});

document.getElementById("btn-wyjdz-z-gry").addEventListener("click", () => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  pokazEkran("ekran-menu");
});

document.querySelectorAll(".btn-mapa").forEach(btn => {
  btn.addEventListener("click", () => {
    uruchomMape(btn.dataset.mapa);
  });
});