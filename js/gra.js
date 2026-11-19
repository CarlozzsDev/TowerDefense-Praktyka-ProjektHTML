import { MapaGry } from "./tekstury.js";
import { Renderer } from "./render.js";
import { pobierzWyniki } from "./storage.js";

const plansza = document.getElementById("plansza");
const mapa = new MapaGry();
const rysownik = new Renderer(plansza);
let idKlatkiAnimacji = null;

// Zmienne sterujące czasem, pauzą i prędkością gry
let czasOstatniejKlatki = 0;
let czyPauza = false;
let mnoznikPredkosci = 1; // 1 = normalna prędkość, 2 = przyspieszenie x2

// Zmienne i elementy do obsługi nicku gracza
let aktualnyGracz = localStorage.getItem("td_ostatni_nick") || "";
const poleNicku = document.getElementById("input-nick");
const komunikatBleduNicku = document.getElementById("blad-nicku");

if (poleNicku) {
  poleNicku.value = aktualnyGracz;
}

// Przełączanie widocznych ekranów
function pokazEkran(idEkranu) {
  document.querySelectorAll(".ekran").forEach(ekran => {
    ekran.classList.add("ukryty");
  });
  document.getElementById(idEkranu).classList.remove("ukryty");
}

// Odświeżanie tabeli wyników z localStorage
function odswiezTabeleWynikow() {
  const cialoTabeli = document.getElementById("lista-wynikow");
  const wyniki = pobierzWyniki();
  cialoTabeli.innerHTML = "";

  if (wyniki.length === 0) {
    cialoTabeli.innerHTML = "<tr><td colspan='3'>Brak zapisanych wyników</td></tr>";
    return;
  }

  wyniki.forEach(wpis => {
    const wiersz = document.createElement("tr");
    const komorkaGracz = document.createElement("td");
    const komorkaMapa = document.createElement("td");
    const komorkaWynik = document.createElement("td");

    komorkaGracz.textContent = wpis.gracz;
    komorkaMapa.textContent = wpis.mapa;
    komorkaWynik.textContent = wpis.wynik;

    wiersz.append(komorkaGracz, komorkaMapa, komorkaWynik);
    cialoTabeli.appendChild(wiersz);
  });
}

// Aktualizacja logiki gry (ruch wrogów, strzelanie wież itp.)
function aktualizujGre(deltaTime) {
  if (deltaTime === 0) return; // Gdy jest pauza, logika stoi w miejscu

  // Tutaj w kolejnych krokach dojdą wywołania:
  // menedzerFal.aktualizuj(deltaTime);
  // przeciwnicy.forEach(wrog => wrog.aktualizuj(deltaTime));
  // wieze.forEach(wieza => wieza.aktualizuj(deltaTime));
}

function pobierzPozycjeNaPlanszy(zdarzenie) {
  const granicePlanszy = plansza.getBoundingClientRect();
  const skalaX = plansza.width / plansza.clientWidth;
  const skalaY = plansza.height / plansza.clientHeight;

  return {
    x: (zdarzenie.clientX - granicePlanszy.left - plansza.clientLeft) * skalaX,
    y: (zdarzenie.clientY - granicePlanszy.top - plansza.clientTop) * skalaY
  };
}

// Główna pętla gry z obliczaniem deltaTime
function petlaGry(aktualnyCzas) {
  // Oblicz różnicę czasu w sekundach (ograniczoną do max 0.1s przy zmianie karty)
  const surowyDeltaTime = Math.min((aktualnyCzas - czasOstatniejKlatki) / 1000, 0.1);
  czasOstatniejKlatki = aktualnyCzas;

  // Jeśli pauza jest aktywna, deltaTime wynosi 0; w przeciwnym razie uwzględnia 1x lub 2x
  const deltaTime = czyPauza ? 0 : surowyDeltaTime * mnoznikPredkosci;

  aktualizujGre(deltaTime);
  rysownik.RysujMape(mapa);

  idKlatkiAnimacji = requestAnimationFrame(petlaGry);
}

// Wczytanie i start wybranej mapy
async function uruchomMape(sciezkaMapy) {
  if (idKlatkiAnimacji) cancelAnimationFrame(idKlatkiAnimacji);

  // Reset stanu pauzy i prędkości przy starcie nowej mapy
  czyPauza = false;
  mnoznikPredkosci = 1;
  document.getElementById("btn-pauza").textContent = "Pauza";
  document.getElementById("btn-przyspieszenie").textContent = "×2";

  await mapa.load(sciezkaMapy);
  rysownik.RozmiarDoMapy(mapa);
  pokazEkran("ekran-gra");

  // Pierwsze wywołanie przez requestAnimationFrame ustawia poprawny czas startowy
  idKlatkiAnimacji = requestAnimationFrame((czasStartu) => {
    czasOstatniejKlatki = czasStartu;
    petlaGry(czasStartu);
  });
}

// Obsługa myszy na Canvasie
plansza.addEventListener("mousemove", (zdarzenie) => {
  const pozycja = pobierzPozycjeNaPlanszy(zdarzenie);
  rysownik.hoveredTile = mapa.getTileAt(pozycja.x, pozycja.y);
});

plansza.addEventListener("click", (zdarzenie) => {
  const pozycja = pobierzPozycjeNaPlanszy(zdarzenie);
  const kliknietyKafelek = mapa.getTileAt(pozycja.x, pozycja.y);
  if (kliknietyKafelek && kliknietyKafelek.type === 2) {
    console.log(`Kliknięto slot na wieżyczkę na pozycji X:${kliknietyKafelek.x}, Y:${kliknietyKafelek.y}`);
  }
});

// Obsługa przycisków HUD w trakcie gry (Pauza i Przyspieszenie)
document.getElementById("btn-pauza").addEventListener("click", (zdarzenie) => {
  czyPauza = !czyPauza;
  zdarzenie.target.textContent = czyPauza ? "Wznów" : "Pauza";
});

document.getElementById("btn-przyspieszenie").addEventListener("click", (zdarzenie) => {
  mnoznikPredkosci = mnoznikPredkosci === 1 ? 2 : 1;
  zdarzenie.target.textContent = mnoznikPredkosci === 2 ? "×1" : "×2";
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

document.querySelectorAll(".btn-powrot").forEach(przycisk => {
  przycisk.addEventListener("click", () => pokazEkran("ekran-menu"));
});

document.getElementById("btn-wyjdz-z-gry").addEventListener("click", () => {
  if (idKlatkiAnimacji) cancelAnimationFrame(idKlatkiAnimacji);
  pokazEkran("ekran-menu");
});

// Sprawdzanie nicku przed startem mapy
document.querySelectorAll(".btn-mapa").forEach(przycisk => {
  przycisk.addEventListener("click", () => {
    const wpisanyNick = poleNicku.value.trim();

    if (!wpisanyNick) {
      komunikatBleduNicku.classList.remove("ukryty");
      poleNicku.focus();
      return;
    }

    komunikatBleduNicku.classList.add("ukryty");
    aktualnyGracz = wpisanyNick;
    localStorage.setItem("td_ostatni_nick", aktualnyGracz);

    uruchomMape(przycisk.dataset.mapa);
  });
});