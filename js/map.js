export const TEKSTURY_KAFELKOW = {
  0: [ // background (trawa/tło)
    "data/kafelki/grass_1.png",
    "data/kafelki/grass_flowers.png"
  ],
  1: [ // ścieżka
    "data/kafelki/path_1.png",
    "data/kafelki/path_pebbles.png"
  ],
  2: [ // miejsce na wieżyczkę
    "data/kafelki/slot_1.png",
    "data/kafelki/slot_2.png"
  ],
  3: [ // start
    "data/kafelki/path_1.png"
  ],
  4: [ // baza
    "data/kafelki/path_1.png"
  ]
};

export class MapaGry {
  constructor() {
    this.id = "";
    this.name = "";
    this.RozmiarMap = 64;
    this.grid = [];
    this.punkty = [];
    this.textureGrid = []; // Zapamiętuje wylosowaną teksturę dla każdego pola
    this.loadedImages = {}; // Pamięć podręczna załadowanych obiektów Image
  }

  async load(mapUrl) {
    const odpowiedz = await fetch(mapUrl);
    const dane = await odpowiedz.json();

    this.id = dane.id;
    this.name = dane.name;
    this.RozmiarMap = dane.RozmiarMap;
    this.grid = dane.grid;
    this.punkty = dane.punkty || [];

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
          // Jeśli brakuje pliku PNG, nie blokuje gry (narysuje kolor zastępczy)
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