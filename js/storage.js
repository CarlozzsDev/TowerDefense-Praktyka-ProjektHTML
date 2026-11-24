const KLUCZ_WYNIKOW = "td_tabela_wynikow_v1";
const ENDPOINT_WYNIKOW_PHP = "wyniki.php";

function pobierzWynikiLokalne() {
  try {
    const surowy = localStorage.getItem(KLUCZ_WYNIKOW);
    if (!surowy) return [];
    const parsed = JSON.parse(surowy);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function zapiszWynikLokalny(gracz, mapa, wynik) {
  try {
    const lista = pobierzWynikiLokalne();
    lista.push({
      gracz: String(gracz).trim().slice(0, 24),
      mapa: String(mapa).trim().slice(0, 40),
      wynik: Math.round(Number(wynik) || 0)
    });
    lista.sort((a, b) => b.wynik - a.wynik);
    localStorage.setItem(KLUCZ_WYNIKOW, JSON.stringify(lista.slice(0, 200)));
  } catch {
  }
}

async function zapiszWynik(gracz, mapa, wynik) {
  zapiszWynikLokalny(gracz, mapa, wynik);

  if (window.location.protocol === "file:") {
    return null;
  }

  try {
    const odpowiedz = await fetch(ENDPOINT_WYNIKOW_PHP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gracz: String(gracz).trim().slice(0, 24),
        mapa: String(mapa).trim().slice(0, 40),
        wynik: Math.round(Number(wynik) || 0)
      })
    });
    if (!odpowiedz.ok) throw new Error(`HTTP ${odpowiedz.status}`);
    return await odpowiedz.json();
  } catch {
    return null;
  }
}

async function pobierzWyniki(limit = 200) {
  if (window.location.protocol === "file:") {
    return pobierzWynikiLokalne().slice(0, limit);
  }

  try {
    const odpowiedz = await fetch(`${ENDPOINT_WYNIKOW_PHP}?limit=${limit}`, {
      cache: "no-store"
    });
    if (!odpowiedz.ok) throw new Error(`HTTP ${odpowiedz.status}`);
    const dane = await odpowiedz.json();
    return Array.isArray(dane) ? dane : pobierzWynikiLokalne();
  } catch {
    return pobierzWynikiLokalne().slice(0, limit);
  }
}