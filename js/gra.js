const plansza = document.getElementById("plansza");
const mapa = new MapaGry();
const rysownik = new Renderer(plansza);
const dzwieki = new Dzwieki("data/audio/muzyka.mp3");
let idKlatkiAnimacji = null;
let idAnimacjiMenu = null;

let czasOstatniejKlatki = 0;
let czyPauza = false;
let mnoznikPredkosci = 1;
let ostatniaSciezkaMapy = "data/maps/mapa1.json";

let konfiguracjaWiez = {};
let konfiguracjaPrzeciwnikow = {};
let wieze = [];
let przeciwnicy = [];
let pociski = [];
let menadzerFal = new MenadzerFal();

let zloto = 150;
let zycia = 20;
let wynikGracza = 0;
let czyKoniecGry = false;

let aktualnyGracz = localStorage.getItem("td_ostatni_nick") || "";
const poleNicku = document.getElementById("input-nick");
const komunikatBleduNicku = document.getElementById("blad-nicku");
const panelSklepu = document.getElementById("panel-sklepu");
const btnNastepnaFala = document.getElementById("btn-nastepna-fala");

const btnDzwiek = document.getElementById("btn-dzwiek");
const menuDzwieku = document.getElementById("menu-dzwieku");
const suwakMuzyka = document.getElementById("suwak-muzyka");
const suwakEfekty = document.getElementById("suwak-efekty");
const wartoscMuzyka = document.getElementById("wartosc-muzyka");
const wartoscEfekty = document.getElementById("wartosc-efekty");
const btnWyciszWszystko = document.getElementById("btn-wycisz-wszystko");

if (poleNicku) {
  poleNicku.value = aktualnyGracz;
}

async function narysujMiniaturkeMapy(canvas, sciezkaMapy) {
  try {
    const dane = await wczytajJsonZFallbackiem(sciezkaMapy);
    const grid = dane.grid;
    if (!grid || !grid.length) return;

    const wiersze = grid.length;
    const kolumny = grid[0].length;
    const skala = Math.floor(Math.min(canvas.width / kolumny, canvas.height / wiersze));
    const offsetX = Math.floor((canvas.width - kolumny * skala) / 2);
    const offsetY = Math.floor((canvas.height - wiersze * skala) / 2);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#17130f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const paleta = {
      0: "#487534",
      1: "#cbb382",
      2: "#7d8287",
      3: "#38a351",
      4: "#c9342b"
    };

    for (let y = 0; y < wiersze; y++) {
      for (let x = 0; x < kolumny; x++) {
        ctx.fillStyle = paleta[grid[y][x]] || "#487534";
        ctx.fillRect(offsetX + x * skala, offsetY + y * skala, skala, skala);
      }
    }
  } catch {
  }
}

async function uruchomAnimowaneTloMenu() {
  const canvasMenu = document.getElementById("tlo-menu-canvas");
  if (!canvasMenu) return;

  try {
    const mapaTla = new MapaGry();
    await mapaTla.load("data/maps/mapa1.json");

    const rozmiar = mapaTla.RozmiarMap;
    canvasMenu.width = mapaTla.grid[0].length * rozmiar;
    canvasMenu.height = mapaTla.grid.length * rozmiar;
    const ctx = canvasMenu.getContext("2d");

    const konfiguracjeWiezeTla = await wczytajKonfiguracjeWiez();
    const konfiguracjeWrogowieTla = await wczytajKonfiguracjePrzeciwnikow();

    const wiezeDekoracyjne = [
      new Wieza(konfiguracjeWiezeTla.Standard, 2, 0),
      new Wieza(konfiguracjeWiezeTla.Slow, 4, 1),
      new Wieza(konfiguracjeWiezeTla.Snajper, 7, 1),
      new Wieza(konfiguracjeWiezeTla.Heavy, 4, 4)
    ];

    const ladujObrazek = (sciezka) => {
      const img = new Image();
      img.src = sciezka;
      return img;
    };

    const obrazkiWiez = new Map(
      wiezeDekoracyjne.map(w => [w, ladujObrazek(w.tekstura)])
    );

    const typyWrogow = ["Normal", "Fast", "Armor", "Fly", "Normal", "Fast"];
    const wrogowieDekoracyjni = typyWrogow.map((typ, i) => {
      const wrog = new Przeciwnik(konfiguracjeWrogowieTla[typ], mapaTla.punkty, rozmiar);
      wrog.aktualizuj(i * 2.4);
      return { instancja: wrog, img: ladujObrazek(wrog.tekstura) };
    });

    let ostatniCzas = performance.now();

    const klatkaMenu = (teraz) => {
      const ekranMenu = document.getElementById("ekran-menu");
      if (ekranMenu.classList.contains("ukryty")) {
        idAnimacjiMenu = requestAnimationFrame(klatkaMenu);
        ostatniCzas = teraz;
        return;
      }

      const dt = Math.min((teraz - ostatniCzas) / 1000, 0.1);
      ostatniCzas = teraz;

      ctx.clearRect(0, 0, canvasMenu.width, canvasMenu.height);

      for (let y = 0; y < mapaTla.grid.length; y++) {
        for (let x = 0; x < mapaTla.grid[y].length; x++) {
          const texSrc = mapaTla.textureGrid[y][x];
          const img = texSrc ? mapaTla.loadedImages[texSrc] : null;
          if (img) {
            ctx.drawImage(img, x * rozmiar, y * rozmiar, rozmiar, rozmiar);
          } else {
            ctx.fillStyle = KOLORY_ZASTEPCZE[mapaTla.grid[y][x]] || "#2b4c24";
            ctx.fillRect(x * rozmiar, y * rozmiar, rozmiar, rozmiar);
          }
        }
      }

      for (const wieza of wiezeDekoracyjne) {
        const img = obrazkiWiez.get(wieza);
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, wieza.kafelekX * rozmiar, wieza.kafelekY * rozmiar, rozmiar, rozmiar);
        }
      }

      wrogowieDekoracyjni.forEach((obiekt, indeks) => {
        obiekt.instancja.aktualizuj(dt);
        if (obiekt.instancja.dotarlDoBazy) {
          const typ = typyWrogow[indeks];
          obiekt.instancja = new Przeciwnik(konfiguracjeWrogowieTla[typ], mapaTla.punkty, rozmiar);
        }

        const w = obiekt.instancja;
        const skala = w.typId === "Boss" ? 0.95 : 0.75;
        const wymiar = rozmiar * skala;

        if (obiekt.img && obiekt.img.complete && obiekt.img.naturalWidth > 0) {
          ctx.drawImage(obiekt.img, w.x - wymiar / 2, w.y - wymiar / 2, wymiar, wymiar);
        }
      });

      idAnimacjiMenu = requestAnimationFrame(klatkaMenu);
    };

    if (idAnimacjiMenu) cancelAnimationFrame(idAnimacjiMenu);
    idAnimacjiMenu = requestAnimationFrame(klatkaMenu);
  } catch {
  }
}

async function inicjalizujPodgladyMap() {
  uruchomAnimowaneTloMenu();

  document.querySelectorAll(".karta-mapy").forEach(karta => {
    const canvas = karta.querySelector(".podglad-mapy");
    const sciezka = karta.dataset.mapa;
    if (canvas && sciezka) {
      narysujMiniaturkeMapy(canvas, sciezka);
    }
  });
}

inicjalizujPodgladyMap();

function odswiezUiDzwieku() {
  const procMuzyka = Math.round(dzwieki.glosnoscMuzyki * 100);
  const procEfekty = Math.round(dzwieki.glosnoscEfektow * 100);

  suwakMuzyka.value = procMuzyka;
  suwakEfekty.value = procEfekty;
  wartoscMuzyka.textContent = `${procMuzyka}%`;
  wartoscEfekty.textContent = `${procEfekty}%`;

  btnDzwiek.textContent = dzwieki.wyciszony ? "Dźwięk (WYŁ) ▾" : "Dźwięk ▾";
  btnWyciszWszystko.textContent = dzwieki.wyciszony ? "Włącz dźwięk" : "Wycisz wszystko";
}

odswiezUiDzwieku();

function pokazEkran(idEkranu) {
  menuDzwieku.classList.add("ukryty");
  document.querySelectorAll(".ekran").forEach(ekran => {
    ekran.classList.add("ukryty");
  });
  document.getElementById(idEkranu).classList.remove("ukryty");
}

function aktualizujHud() {
  document.getElementById("licznik-fal").textContent = menadzerFal.pobierzAktualnyNumerWyswietlany();
  document.getElementById("licznik-zlota").textContent = zloto;
  document.getElementById("licznik-zyc").textContent = zycia;

  if (menadzerFal.czyFalaAktywna || menadzerFal.czyWszystkieFaleUkonczone || czyKoniecGry) {
    btnNastepnaFala.disabled = true;
    btnNastepnaFala.textContent = "Fala w toku";
  } else {
    btnNastepnaFala.disabled = false;
    if (menadzerFal.numerFali === 0) {
      btnNastepnaFala.textContent = "Start fali 1";
    } else {
      const sekundy = Math.ceil(menadzerFal.czasDoNastepnejFali);
      btnNastepnaFala.textContent = `Następna fala (${sekundy}s)`;
    }
  }
}

function odswiezPanelSklepu() {
  rysownik.podgladZasieguSklepu = null;
  const wybrany = rysownik.selectedTile;

  if (!wybrany) {
    panelSklepu.innerHTML = `
      <h3>Warsztat budowy</h3>
      <p class="podpowiedz-sklepu">Kliknij świecące pole na mapie, aby postawić wieżę.</p>
    `;
    return;
  }

  const istniejacaWieza = wieze.find(
    w => w.kafelekX === wybrany.x && w.kafelekY === wybrany.y
  );

  if (istniejacaWieza) {
    const nastepneUlepszenie = istniejacaWieza.pobierzNastepneUlepszenie();
    const cenaSprzedazy = istniejacaWieza.pobierzWartoscSprzedazy();

    let przyciskUlepszeniaHtml = `<p class="podpowiedz-sklepu">Osiągnięto maksymalny poziom wieży.</p>`;
    if (nastepneUlepszenie) {
      const stacGracza = zloto >= nastepneUlepszenie.koszt;
      przyciskUlepszeniaHtml = `
        <button id="btn-ulepsz-wieze" class="btn-glowny" ${stacGracza ? "" : "disabled"}>
          Ulepsz (${nastepneUlepszenie.koszt})
        </button>
        <p class="opis-wiezy-sklep">${nastepneUlepszenie.opis}</p>
      `;
    }

    panelSklepu.innerHTML = `
      <h3>Wieża na polu (${wybrany.x}, ${wybrany.y})</h3>
      <div class="podglad-wybranej-wiezy">
        <img src="${istniejacaWieza.tekstura}" alt="${istniejacaWieza.nazwa}">
        <div>
          <strong>${istniejacaWieza.nazwa}</strong>
          <div class="pasek-poziomu">
            <span class="kropka-poziomu aktywna"></span>
            <span class="kropka-poziomu ${istniejacaWieza.poziom >= 1 ? "aktywna" : ""}"></span>
            <span class="kropka-poziomu ${istniejacaWieza.poziom >= 2 ? "aktywna" : ""}"></span>
          </div>
        </div>
      </div>

      <ul class="staty-wiezy">
        <li><span>Obrażenia</span><strong>${istniejacaWieza.obrazenia}</strong></li>
        <li><span>Szybkostrzelność</span><strong>${istniejacaWieza.szybkoscStrzalu}/s</strong></li>
        <li><span>Zasięg</span><strong>${istniejacaWieza.zasieg} pol</strong></li>
      </ul>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${przyciskUlepszeniaHtml}
        <button id="btn-sprzedaj-wieze" class="btn-sprzedaj">
          Usuń (+${cenaSprzedazy})
        </button>
      </div>
    `;

    const btnUlepsz = document.getElementById("btn-ulepsz-wieze");
    if (btnUlepsz && nastepneUlepszenie) {
      btnUlepsz.addEventListener("click", () => {
        if (zloto >= nastepneUlepszenie.koszt && istniejacaWieza.ulepsz()) {
          zloto -= nastepneUlepszenie.koszt;
          aktualizujHud();
          odswiezPanelSklepu();
        }
      });
    }

    document.getElementById("btn-sprzedaj-wieze").addEventListener("click", () => {
      zloto += cenaSprzedazy;
      wieze = wieze.filter(w => w !== istniejacaWieza);
      aktualizujHud();
      odswiezPanelSklepu();
    });

    return;
  }

  const listaPrzyciskow = Object.values(konfiguracjaWiez)
    .map(konfig => {
      const stacGracza = zloto >= konfig.koszt;
      const bijeLatajace = konfig.trafialatajacych || konfig.celujeWLatajace;
      return `
        <div class="karta-wiezy-sklep" data-zasieg="${konfig.zasieg}">
          <div class="naglowek-wiezy-sklep">
            <img class="ikona-wiezy-sklep" src="${konfig.tekstura}" alt="${konfig.nazwa}">
            <div class="tytul-wiezy-sklep">
              <strong>${konfig.nazwa}</strong>
              <span class="znacznik-plot">${bijeLatajace ? "Ziemia + Powietrze" : "Tylko ziemia"}</span>
            </div>
          </div>
          <p class="opis-wiezy-sklep">${konfig.opis}</p>
          <button class="btn-kup-wieze" data-typ="${konfig.id}" ${stacGracza ? "" : "disabled"}>
            Zbuduj (${konfig.koszt})
          </button>
        </div>
      `;
    })
    .join("");

  panelSklepu.innerHTML = `
    <h3>Fundament (${wybrany.x}, ${wybrany.y})</h3>
    ${listaPrzyciskow}
  `;

  panelSklepu.querySelectorAll(".karta-wiezy-sklep").forEach(karta => {
    karta.addEventListener("mouseenter", () => {
      rysownik.podgladZasieguSklepu = Number(karta.dataset.zasieg) || null;
    });
    karta.addEventListener("mouseleave", () => {
      rysownik.podgladZasieguSklepu = null;
    });
  });

  panelSklepu.querySelectorAll(".btn-kup-wieze").forEach(przycisk => {
    przycisk.addEventListener("click", () => {
      const wybranyTyp = przycisk.dataset.typ;
      const konfig = Object.values(konfiguracjaWiez).find(w => w.id === wybranyTyp);

      if (!konfig || zloto < konfig.koszt) return;

      zloto -= konfig.koszt;
      const nowaWieza = new Wieza(konfig, wybrany.x, wybrany.y);
      wieze.push(nowaWieza);

      aktualizujHud();
      odswiezPanelSklepu();
    });
  });
}

function odswiezTabeleWynikow() {
  const cialoTabeli = document.getElementById("lista-wynikow");
  const wyniki = pobierzWyniki();
  cialoTabeli.innerHTML = "";

  if (wyniki.length === 0) {
    cialoTabeli.innerHTML = "<tr><td colspan='4'>Brak rekordów - rozegraj pierwszą grę.</td></tr>";
    return;
  }

  wyniki.forEach((wpis, indeks) => {
    const wiersz = document.createElement("tr");
    const komorkaMiejsce = document.createElement("td");
    const komorkaGracz = document.createElement("td");
    const komorkaMapa = document.createElement("td");
    const komorkaWynik = document.createElement("td");

    komorkaMiejsce.textContent = `${indeks + 1}.`;
    komorkaGracz.textContent = wpis.gracz;
    komorkaMapa.textContent = wpis.mapa;
    komorkaWynik.textContent = `${wpis.wynik} pkt`;

    wiersz.append(komorkaMiejsce, komorkaGracz, komorkaMapa, komorkaWynik);
    cialoTabeli.appendChild(wiersz);
  });
}

function zespawnujPrzeciwnika(typId) {
  const konfig = konfiguracjaPrzeciwnikow[typId];
  if (!konfig || !mapa.punkty || mapa.punkty.length < 2) return;
  przeciwnicy.push(new Przeciwnik(konfig, mapa.punkty, mapa.RozmiarMap));
}

function zakonczGre(czyWygrana) {
  if (czyKoniecGry) return;
  czyKoniecGry = true;
  if (idKlatkiAnimacji) cancelAnimationFrame(idKlatkiAnimacji);

  const koncowyWynik = wynikGracza + zloto + (czyWygrana ? zycia * 25 : 0);
  const nazwaMapy = mapa.name || mapa.id;

  zapiszWynik(aktualnyGracz, nazwaMapy, koncowyWynik);
  dzwieki.stopMuzyki();
  dzwieki.grajKoniecGry(czyWygrana);
  aktualizujHud();
  rysownik.wyczyscGify();

  const tytul = document.getElementById("tytul-koniec-gry");
  tytul.textContent = czyWygrana ? "Twierdza ocalona!" : "Twierdza zdobyta!";
  tytul.style.color = czyWygrana ? "#70a33e" : "#f0655b";

  document.getElementById("opis-koniec-gry").textContent = czyWygrana
    ? "Wszystkie 15 fal najeźdźców zostało odpartych."
    : "Wrogie oddziały przełamały obronę.";
  document.getElementById("koniec-gracz").textContent = aktualnyGracz;
  document.getElementById("koniec-mapa").textContent = nazwaMapy;
  document.getElementById("koniec-wynik").textContent = `${koncowyWynik} pkt`;

  pokazEkran("ekran-koniec-gry");
}

function aktualizujGre(deltaTime) {
  if (deltaTime === 0 || czyKoniecGry) return;

  let czyZmienilSieStan = false;

  menadzerFal.aktualizuj(
    deltaTime,
    przeciwnicy.length,
    (typWroga) => {
      zespawnujPrzeciwnika(typWroga);
    },
    (bonusZaFale, czyKoniecMapy) => {
      zloto += bonusZaFale;
      wynikGracza += bonusZaFale * 2;
      czyZmienilSieStan = true;
      dzwieki.grajKoniecFali();

      if (czyKoniecMapy && zycia > 0) {
        zakonczGre(true);
      }
    }
  );

  for (const wrog of przeciwnicy) {
    wrog.aktualizuj(deltaTime);
    if (wrog.dotarlDoBazy) {
      zycia = Math.max(0, zycia - wrog.obrazeniaBazy);
      czyZmienilSieStan = true;
    }
  }

  for (const wieza of wieze) {
    wieza.aktualizuj(deltaTime, przeciwnicy, mapa.RozmiarMap, (strzelajacaWieza, cel) => {
      pociski.push(new Pocisk(strzelajacaWieza, cel, mapa.RozmiarMap));
      dzwieki.grajStrzal(strzelajacaWieza.typId);
    });
  }

  for (const pocisk of pociski) {
    const bytyAktywny = pocisk.aktywny;
    const zabici = pocisk.aktualizuj(deltaTime, przeciwnicy, mapa.RozmiarMap);

    if (bytyAktywny && !pocisk.aktywny && pocisk.cel && !pocisk.cel.dotarlDoBazy) {
      dzwieki.grajTrafienie();
    }

    for (const zabity of zabici) {
      zloto += zabity.nagroda;
      wynikGracza += zabity.nagroda * 5;
      czyZmienilSieStan = true;
    }
  }

  przeciwnicy = przeciwnicy.filter(w => !w.czyMartwy && !w.dotarlDoBazy);
  pociski = pociski.filter(p => p.aktywny);

  if (zycia <= 0) {
    zakonczGre(false);
    return;
  }

  aktualizujHud();
  if (czyZmienilSieStan && rysownik.selectedTile) {
    odswiezPanelSklepu();
  }
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

function petlaGry(aktualnyCzas) {
  const surowyDeltaTime = Math.min((aktualnyCzas - czasOstatniejKlatki) / 1000, 0.1);
  czasOstatniejKlatki = aktualnyCzas;

  const deltaTime = czyPauza ? 0 : surowyDeltaTime * mnoznikPredkosci;

  aktualizujGre(deltaTime);
  if (!czyKoniecGry) {
    rysownik.RysujMape(mapa, wieze, przeciwnicy, pociski);
    idKlatkiAnimacji = requestAnimationFrame(petlaGry);
  }
}

async function uruchomMape(sciezkaMapy) {
  if (idKlatkiAnimacji) cancelAnimationFrame(idKlatkiAnimacji);
  ostatniaSciezkaMapy = sciezkaMapy;

  try {
    if (Object.keys(konfiguracjaWiez).length === 0) {
      konfiguracjaWiez = await wczytajKonfiguracjeWiez();
    }
    if (Object.keys(konfiguracjaPrzeciwnikow).length === 0) {
      konfiguracjaPrzeciwnikow = await wczytajKonfiguracjePrzeciwnikow();
    }
    await mapa.load(sciezkaMapy);
  } catch (blad) {
    alert(`Błąd ładowania zasobów: ${blad.message}`);
    return;
  }

  wieze = [];
  przeciwnicy = [];
  pociski = [];
  menadzerFal = new MenadzerFal(mapa.fale);

  zloto = 150;
  zycia = 20;
  wynikGracza = 0;
  czyKoniecGry = false;
  czyPauza = false;
  mnoznikPredkosci = 1;

  document.getElementById("btn-pauza").textContent = "Pauza";
  document.getElementById("btn-przyspieszenie").textContent = "×2";

  rysownik.hoveredTile = null;
  rysownik.selectedTile = null;
  rysownik.podgladZasieguSklepu = null;
  rysownik.RozmiarDoMapy(mapa);

  aktualizujHud();
  odswiezPanelSklepu();
  dzwieki.startMuzyki();
  pokazEkran("ekran-gra");

  idKlatkiAnimacji = requestAnimationFrame((czasStartu) => {
    czasOstatniejKlatki = czasStartu;
    petlaGry(czasStartu);
  });
}

plansza.addEventListener("mousemove", (zdarzenie) => {
  const pozycja = pobierzPozycjeNaPlanszy(zdarzenie);
  rysownik.hoveredTile = mapa.getTileAt(pozycja.x, pozycja.y);
});

plansza.addEventListener("mouseleave", () => {
  rysownik.hoveredTile = null;
});

plansza.addEventListener("click", (zdarzenie) => {
  dzwieki.inicjalizuj();
  const pozycja = pobierzPozycjeNaPlanszy(zdarzenie);
  const kliknietyKafelek = mapa.getTileAt(pozycja.x, pozycja.y);

  if (kliknietyKafelek && kliknietyKafelek.type === 2) {
    rysownik.selectedTile = { x: kliknietyKafelek.x, y: kliknietyKafelek.y };
  } else {
    rysownik.selectedTile = null;
  }

  odswiezPanelSklepu();
});

btnNastepnaFala.addEventListener("click", () => {
  if (czyPauza || czyKoniecGry) return;
  dzwieki.inicjalizuj();
  const bonus = menadzerFal.wywolajWczesniej();
  if (bonus > 0) {
    zloto += bonus;
    wynikGracza += bonus * 2;
  }
  aktualizujHud();
  if (rysownik.selectedTile) {
    odswiezPanelSklepu();
  }
});

document.getElementById("btn-pauza").addEventListener("click", (zdarzenie) => {
  czyPauza = !czyPauza;
  zdarzenie.target.textContent = czyPauza ? "Wznów" : "Pauza";
  if (czyPauza) {
    dzwieki.pauzaMuzyki();
  } else {
    dzwieki.wznowMuzyke();
  }
});

document.getElementById("btn-przyspieszenie").addEventListener("click", (zdarzenie) => {
  mnoznikPredkosci = mnoznikPredkosci === 1 ? 2 : 1;
  zdarzenie.target.textContent = mnoznikPredkosci === 2 ? "×1" : "×2";
});

btnDzwiek.addEventListener("click", (zdarzenie) => {
  zdarzenie.stopPropagation();
  menuDzwieku.classList.toggle("ukryty");
});

menuDzwieku.addEventListener("click", (zdarzenie) => {
  zdarzenie.stopPropagation();
});

document.addEventListener("click", () => {
  menuDzwieku.classList.add("ukryty");
});

suwakMuzyka.addEventListener("input", () => {
  dzwieki.inicjalizuj();
  dzwieki.ustawGlosnoscMuzyki(Number(suwakMuzyka.value) / 100);
  odswiezUiDzwieku();
});

suwakEfekty.addEventListener("input", () => {
  dzwieki.inicjalizuj();
  dzwieki.ustawGlosnoscEfektow(Number(suwakEfekty.value) / 100);
  odswiezUiDzwieku();
});

suwakEfekty.addEventListener("change", () => {
  dzwieki.grajTrafienie();
});

btnWyciszWszystko.addEventListener("click", () => {
  dzwieki.przelaczWyciszenie();
  odswiezUiDzwieku();
});

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
  dzwieki.stopMuzyki();
  rysownik.wyczyscGify();
  pokazEkran("ekran-menu");
});

document.getElementById("btn-zagraj-ponownie").addEventListener("click", () => {
  uruchomMape(ostatniaSciezkaMapy);
});

document.getElementById("btn-koniec-wyniki").addEventListener("click", () => {
  odswiezTabeleWynikow();
  pokazEkran("ekran-wyniki");
});

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

    dzwieki.inicjalizuj();
    uruchomMape(przycisk.dataset.mapa);
  });
});