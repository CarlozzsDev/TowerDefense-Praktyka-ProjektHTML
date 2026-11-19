const KLUCZ_WYNIKOW = "td_tabela_wynikow";

export function pobierzWyniki() {
  const dane = localStorage.getItem(KLUCZ_WYNIKOW);
  return dane ? JSON.parse(dane) : [];
}

export function zapiszWynik(gracz, mapa, wynik) {
  const wyniki = pobierzWyniki();
  wyniki.push({ gracz, mapa, wynik });
  wyniki.sort((a, b) => b.wynik - a.wynik);
  localStorage.setItem(KLUCZ_WYNIKOW, JSON.stringify(wyniki.slice(0, 10)));
}