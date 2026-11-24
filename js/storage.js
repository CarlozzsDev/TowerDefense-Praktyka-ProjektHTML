const KLUCZ_WYNIKOW = "td_tabela_wynikow";

function pobierzWyniki() {
  try {
    const surowe = localStorage.getItem(KLUCZ_WYNIKOW);
    return surowe ? JSON.parse(surowe) : [];
  } catch {
    return [];
  }
}

function zapiszWynik(gracz, mapa, wynik) {
  const lista = pobierzWyniki();
  lista.push({
    gracz: gracz.trim() || "Anonim",
    mapa: mapa,
    wynik: Number(wynik),
    data: new Date().toISOString()
  });

  lista.sort((a, b) => b.wynik - a.wynik);
  const top10 = lista.slice(0, 10);
  localStorage.setItem(KLUCZ_WYNIKOW, JSON.stringify(top10));
}