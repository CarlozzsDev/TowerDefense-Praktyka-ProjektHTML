const TEKSTURY_KAFELKOW = {
  0: [
    "data/kafelki/grass_1.png",
    "data/kafelki/grass_2.png",
    "data/kafelki/grass_3.png",
    "data/kafelki/grass_1.png",
    "data/kafelki/grass_2.png",
    "data/kafelki/grass_3.png",
    "data/kafelki/grass_flowers.png",
    "data/kafelki/grass_flowers_2.png"
  ],
  1: [
    "data/kafelki/path_1.png",
    "data/kafelki/path_pebbles.png",
    "data/kafelki/path_pebbles_2.png",
    "data/kafelki/path_pebbles_3.png"
  ],
  2: [
    "data/kafelki/slot_1.png",
    "data/kafelki/slot_2.png"
  ],
  3: [
    "data/kafelki/start1.png"
  ],
  4: [
    "data/kafelki/end1.png"
  ]
};

async function wczytajJsonZFallbackiem(url) {
  if (window.location.protocol !== "file:") {
    try {
      const odpowiedz = await fetch(url, { cache: "no-store" });
      if (odpowiedz.ok) {
        const tekst = await odpowiedz.text();
        if (tekst.trim()) {
          return JSON.parse(tekst);
        }
      }
    } catch {
      // Fallback do danych lokalnych
    }
  }

  if (window.DANE_LOKALNE_TD && window.DANE_LOKALNE_TD[url]) {
    return JSON.parse(JSON.stringify(window.DANE_LOKALNE_TD[url]));
  }

  throw new Error(`Nie udało się wczytać pliku ${url}`);
}

class MapaGry {
  constructor() {
    this.id = "";
    this.name = "";
    this.RozmiarMap = 64;
    this.mnoznikBossa = 1.0;
    this.grid = [];
    this.punkty = [];
    this.fale = [];
    this.textureGrid = [];
    this.loadedImages = {};
  }

  async load(mapUrl) {
    const dane = await wczytajJsonZFallbackiem(mapUrl);

    this.id = dane.id;
    this.name = dane.name;
    this.RozmiarMap = dane.RozmiarMap || dane.tileSize || 64;
    this.mnoznikBossa = dane.mnoznikBossa !== undefined ? Number(dane.mnoznikBossa) : 1.0;
    this.grid = dane.grid;
    this.punkty = dane.punkty || [];
    this.fale = dane.fale || [];

    await this.preloadTeksturMap();
    this.generujLosowaTeksturaGridu();
  }

  async preloadTeksturMap() {
    const sciezki = new Set(Object.values(TEKSTURY_KAFELKOW).flat());
    const ladowanie = Array.from(sciezki).map(src => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          this.loadedImages[src] = img;
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
      });
    });
    await Promise.all(ladowanie);
  }

  generujLosowaTeksturaGridu() {
    this.textureGrid = this.grid.map(row =>
      row.map(typ => {
        const warianty = TEKSTURY_KAFELKOW[typ];
        if (!warianty || warianty.length === 0) return null;
        const los = Math.floor(Math.random() * warianty.length);
        return warianty[los];
      })
    );
  }

  getTileAt(pixelX, pixelY) {
    const x = Math.floor(pixelX / this.RozmiarMap);
    const y = Math.floor(pixelY / this.RozmiarMap);
    if (y < 0 || y >= this.grid.length || x < 0 || x >= this.grid[0].length) {
      return null;
    }
    return { x, y, type: this.grid[y][x] };
  }
}
