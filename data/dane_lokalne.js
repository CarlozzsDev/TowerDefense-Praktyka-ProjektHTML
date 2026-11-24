window.DANE_LOKALNE_TD = {
  "data/wieze.json": {
    "Standard": {
      "id": "Standard",
      "nazwa": "Standard",
      "opis": "Szybko strzela w jeden cel naziemny. Nie trafia latających.",
      "koszt": 50,
      "obrazenia": 8,
      "szybkoscStrzalu": 2.0,
      "zasieg": 2.5,
      "trafialatajacych": false,
      "kolor": "#3b82f6",
      "tekstura": "data/wieze/standard.gif",
      "teksturaPocisku": "data/pociski/standard.png",
      "ulepszenia": [
        {
          "opis": "Obrażenia: 8 -> 12",
          "koszt": 40,
          "obrazenia": 12
        },
        {
          "opis": "Szybkość: 2.0 -> 3.0 strz./s",
          "koszt": 70,
          "szybkoscStrzalu": 3.0
        }
      ]
    },
    "Heavy": {
      "id": "Heavy",
      "nazwa": "Heavy",
      "opis": "Wolne strzały oraz duże obrażenia obszarowe (1 kafelek).",
      "koszt": 120,
      "obrazenia": 40,
      "szybkoscStrzalu": 0.5,
      "zasieg": 2.0,
      "zasiegObszarowy": 1.0,
      "trafialatajacych": false,
      "kolor": "#ef4444",
      "tekstura": "data/wieze/heavy.gif",
      "teksturaPocisku": "data/pociski/heavy.png",
      "ulepszenia": [
        {
          "opis": "Obszar wybuchu: 1.0 -> 1.5 kafelka",
          "koszt": 90,
          "zasiegObszarowy": 1.5
        },
        {
          "opis": "Obrażenia: 40 -> 70",
          "koszt": 150,
          "obrazenia": 70
        }
      ]
    },
    "Slow": {
      "id": "Slow",
      "nazwa": "Slow",
      "opis": "Spowalnia wrogów (30% na 2s). Trafia latających.",
      "koszt": 80,
      "obrazenia": 3,
      "szybkoscStrzalu": 1.0,
      "zasieg": 2.0,
      "spowolnienie": 0.3,
      "czasSpowolnienia": 2.0,
      "trafialatajacych": true,
      "kolor": "#38bdf8",
      "tekstura": "data/wieze/slow.gif",
      "teksturaPocisku": "data/pociski/slow.png",
      "ulepszenia": [
        {
          "opis": "Spowolnienie: 30% -> 50%",
          "koszt": 60,
          "spowolnienie": 0.5
        },
        {
          "opis": "Zasięg: 2.0 -> 3.0 kafelka",
          "koszt": 100,
          "zasieg": 3.0
        }
      ]
    },
    "Snajper": {
      "id": "Snajper",
      "nazwa": "Snajper",
      "opis": "Duży zasięg, wolny strzał oraz duże obrażenia. Trafia latających.",
      "koszt": 150,
      "obrazenia": 60,
      "szybkoscStrzalu": 0.33,
      "zasieg": 6.0,
      "trafialatajacych": true,
      "przebijaPancerz": false,
      "kolor": "#a855f7",
      "tekstura": "data/wieze/snajper.gif",
      "teksturaPocisku": "data/pociski/snajper.png",
      "ulepszenia": [
        {
          "opis": "Obrażenia: 60 -> 100",
          "koszt": 120,
          "obrazenia": 100
        },
        {
          "opis": "Przebija pancerz",
          "koszt": 200,
          "przebijaPancerz": true
        }
      ]
    }
  },
  "data/przeciwnicy.json": {
    "Normal": {
      "id": "Normal",
      "nazwa": "Normal",
      "hp": 40,
      "predkosc": 1.0,
      "nagroda": 5,
      "obrazeniaBazy": 1,
      "czyLatajacy": false,
      "odpornoscNaSpowolnienie": false,
      "odpornoscStandard": 1.0,
      "kolor": "#84a98c",
      "tekstura": "data/przeciwnicy/normal.gif"
    },
    "Fast": {
      "id": "Fast",
      "nazwa": "Fast",
      "hp": 20,
      "predkosc": 2.2,
      "nagroda": 6,
      "obrazeniaBazy": 1,
      "czyLatajacy": false,
      "odpornoscNaSpowolnienie": false,
      "odpornoscStandard": 1.0,
      "kolor": "#facc15",
      "tekstura": "data/przeciwnicy/fast.gif"
    },
    "Armor": {
      "id": "Armor",
      "nazwa": "Armor",
      "hp": 150,
      "predkosc": 0.6,
      "nagroda": 15,
      "obrazeniaBazy": 2,
      "czyLatajacy": false,
      "odpornoscNaSpowolnienie": false,
      "odpornoscStandard": 0.5,
      "kolor": "#64748b",
      "tekstura": "data/przeciwnicy/armor.gif"
    },
    "Fly": {
      "id": "Fly",
      "nazwa": "Fly",
      "hp": 35,
      "predkosc": 1.4,
      "nagroda": 10,
      "obrazeniaBazy": 1,
      "czyLatajacy": true,
      "odpornoscNaSpowolnienie": false,
      "odpornoscStandard": 1.0,
      "kolor": "#38bdf8",
      "tekstura": "data/przeciwnicy/fly.gif"
    },
    "Boss": {
      "id": "Boss",
      "nazwa": "Boss",
      "hp": 1200,
      "predkosc": 0.5,
      "nagroda": 100,
      "obrazeniaBazy": 5,
      "czyLatajacy": false,
      "odpornoscNaSpowolnienie": true,
      "odpornoscStandard": 1.0,
      "kolor": "#dc2626",
      "tekstura": "data/przeciwnicy/boss.gif"
    }
  },
  "data/maps/mapa1.json": {
    "id": "mapa1",
    "name": "testowa mapa 1",
    "RozmiarMap": 64,
    "grid": [
      [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [3, 1, 1, 1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "punkty": [
      { "x": 0, "y": 1 }, { "x": 1, "y": 1 }, { "x": 3, "y": 1 }, { "x": 3, "y": 3 },
      { "x": 17, "y": 3 }, { "x": 17, "y": 5 }, { "x": 8, "y": 5 }, { "x": 8, "y": 8 },
      { "x": 17, "y": 8 }, { "x": 17, "y": 10 }, { "x": 18, "y": 10 }, { "x": 19, "y": 10 }
    ],
    "fale": [
      { "odstep": 1.0, "bonus": 20, "wrogowie": [{ "typ": "Normal", "ilosc": 8 }] },
      { "odstep": 0.85, "bonus": 20, "wrogowie": [{ "typ": "Normal", "ilosc": 12 }] },
      { "odstep": 0.8, "bonus": 25, "wrogowie": [{ "typ": "Normal", "ilosc": 8 }, { "typ": "Fast", "ilosc": 5 }] },
      { "odstep": 0.75, "bonus": 25, "wrogowie": [{ "typ": "Normal", "ilosc": 12 }, { "typ": "Armor", "ilosc": 3 }] },
      { "odstep": 0.65, "bonus": 50, "wrogowie": [{ "typ": "Fast", "ilosc": 10 }, { "typ": "Boss", "ilosc": 1 }] },
      { "odstep": 0.65, "bonus": 30, "wrogowie": [{ "typ": "Normal", "ilosc": 14 }, { "typ": "Fast", "ilosc": 8 }, { "typ": "Armor", "ilosc": 4 }] },
      { "odstep": 0.6, "bonus": 35, "wrogowie": [{ "typ": "Normal", "ilosc": 12 }, { "typ": "Fly", "ilosc": 6 }] },
      { "odstep": 0.6, "bonus": 40, "wrogowie": [{ "typ": "Armor", "ilosc": 6 }, { "typ": "Fast", "ilosc": 10 }, { "typ": "Fly", "ilosc": 5 }] },
      { "odstep": 0.55, "bonus": 45, "wrogowie": [{ "typ": "Normal", "ilosc": 18 }, { "typ": "Fly", "ilosc": 8 }, { "typ": "Armor", "ilosc": 5 }] },
      { "odstep": 0.55, "bonus": 80, "wrogowie": [{ "typ": "Armor", "ilosc": 6 }, { "typ": "Fast", "ilosc": 12 }, { "typ": "Boss", "ilosc": 1 }] },
      { "odstep": 0.5, "bonus": 50, "wrogowie": [{ "typ": "Fast", "ilosc": 18 }, { "typ": "Fly", "ilosc": 10 }] },
      { "odstep": 0.5, "bonus": 55, "wrogowie": [{ "typ": "Armor", "ilosc": 10 }, { "typ": "Normal", "ilosc": 20 }] },
      { "odstep": 0.45, "bonus": 60, "wrogowie": [{ "typ": "Fast", "ilosc": 16 }, { "typ": "Armor", "ilosc": 8 }, { "typ": "Fly", "ilosc": 12 }] },
      { "odstep": 0.45, "bonus": 70, "wrogowie": [{ "typ": "Normal", "ilosc": 24 }, { "typ": "Armor", "ilosc": 10 }, { "typ": "Fly", "ilosc": 12 }] },
      { "odstep": 0.4, "bonus": 200, "wrogowie": [{ "typ": "Fast", "ilosc": 15 }, { "typ": "Armor", "ilosc": 10 }, { "typ": "Fly", "ilosc": 10 }, { "typ": "Boss", "ilosc": 2 }] }
    ]
  },
  "data/maps/mapa2.json": {
    "id": "mapa2",
    "name": "Mapa 2: Średnia",
    "RozmiarMap": 64,
    "grid": [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
      [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "punkty": [
      { "x": 0, "y": 2 }, { "x": 15, "y": 2 }, { "x": 15, "y": 5 },
      { "x": 4, "y": 5 }, { "x": 4, "y": 8 }, { "x": 19, "y": 8 }
    ],
    "fale": [
      { "odstep": 0.9, "bonus": 20, "wrogowie": [{ "typ": "Normal", "ilosc": 10 }] },
      { "odstep": 0.8, "bonus": 25, "wrogowie": [{ "typ": "Normal", "ilosc": 10 }, { "typ": "Fast", "ilosc": 4 }] },
      { "odstep": 0.75, "bonus": 25, "wrogowie": [{ "typ": "Fast", "ilosc": 10 }, { "typ": "Normal", "ilosc": 6 }] },
      { "odstep": 0.7, "bonus": 30, "wrogowie": [{ "typ": "Normal", "ilosc": 10 }, { "typ": "Armor", "ilosc": 4 }] },
      { "odstep": 0.65, "bonus": 55, "wrogowie": [{ "typ": "Fast", "ilosc": 8 }, { "typ": "Armor", "ilosc": 2 }, { "typ": "Boss", "ilosc": 1 }] },
      { "odstep": 0.6, "bonus": 35, "wrogowie": [{ "typ": "Normal", "ilosc": 14 }, { "typ": "Fly", "ilosc": 6 }] },
      { "odstep": 0.55, "bonus": 40, "wrogowie": [{ "typ": "Fast", "ilosc": 12 }, { "typ": "Fly", "ilosc": 8 }] },
      { "odstep": 0.55, "bonus": 45, "wrogowie": [{ "typ": "Armor", "ilosc": 7 }, { "typ": "Normal", "ilosc": 12 }] },
      { "odstep": 0.5, "bonus": 50, "wrogowie": [{ "typ": "Fast", "ilosc": 14 }, { "typ": "Armor", "ilosc": 5 }, { "typ": "Fly", "ilosc": 8 }] },
      { "odstep": 0.5, "bonus": 90, "wrogowie": [{ "typ": "Armor", "ilosc": 6 }, { "typ": "Fly", "ilosc": 8 }, { "typ": "Boss", "ilosc": 1 }] },
      { "odstep": 0.45, "bonus": 55, "wrogowie": [{ "typ": "Fast", "ilosc": 22 }, { "typ": "Fly", "ilosc": 10 }] },
      { "odstep": 0.45, "bonus": 60, "wrogowie": [{ "typ": "Armor", "ilosc": 12 }, { "typ": "Fast", "ilosc": 12 }] },
      { "odstep": 0.42, "bonus": 65, "wrogowie": [{ "typ": "Normal", "ilosc": 20 }, { "typ": "Armor", "ilosc": 8 }, { "typ": "Fly", "ilosc": 14 }] },
      { "odstep": 0.4, "bonus": 75, "wrogowie": [{ "typ": "Fast", "ilosc": 20 }, { "typ": "Armor", "ilosc": 10 }, { "typ": "Fly", "ilosc": 14 }] },
      { "odstep": 0.38, "bonus": 220, "wrogowie": [{ "typ": "Fast", "ilosc": 18 }, { "typ": "Armor", "ilosc": 12 }, { "typ": "Fly", "ilosc": 14 }, { "typ": "Boss", "ilosc": 2 }] }
    ]
  },
  "data/maps/mapa3.json": {
    "id": "mapa3",
    "name": "Mapa 3: Trudna",
    "RozmiarMap": 64,
    "grid": [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
      [3, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 4],
      [0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "punkty": [
      { "x": 0, "y": 4 }, { "x": 7, "y": 4 }, { "x": 7, "y": 7 },
      { "x": 11, "y": 7 }, { "x": 11, "y": 4 }, { "x": 19, "y": 4 }
    ],
    "fale": [
      { "odstep": 0.85, "bonus": 25, "wrogowie": [{ "typ": "Normal", "ilosc": 10 }, { "typ": "Fast", "ilosc": 4 }] },
      { "odstep": 0.75, "bonus": 25, "wrogowie": [{ "typ": "Fast", "ilosc": 12 }, { "typ": "Normal", "ilosc": 8 }] },
      { "odstep": 0.7, "bonus": 30, "wrogowie": [{ "typ": "Normal", "ilosc": 10 }, { "typ": "Armor", "ilosc": 5 }] },
      { "odstep": 0.65, "bonus": 35, "wrogowie": [{ "typ": "Fast", "ilosc": 14 }, { "typ": "Fly", "ilosc": 6 }] },
      { "odstep": 0.6, "bonus": 65, "wrogowie": [{ "typ": "Armor", "ilosc": 4 }, { "typ": "Fast", "ilosc": 10 }, { "typ": "Boss", "ilosc": 1 }] },
      { "odstep": 0.55, "bonus": 40, "wrogowie": [{ "typ": "Armor", "ilosc": 8 }, { "typ": "Fly", "ilosc": 8 }] },
      { "odstep": 0.5, "bonus": 45, "wrogowie": [{ "typ": "Fast", "ilosc": 18 }, { "typ": "Fly", "ilosc": 10 }] },
      { "odstep": 0.5, "bonus": 50, "wrogowie": [{ "typ": "Normal", "ilosc": 22 }, { "typ": "Armor", "ilosc": 8 }] },
      { "odstep": 0.45, "bonus": 55, "wrogowie": [{ "typ": "Fast", "ilosc": 16 }, { "typ": "Armor", "ilosc": 8 }, { "typ": "Fly", "ilosc": 12 }] },
      { "odstep": 0.45, "bonus": 100, "wrogowie": [{ "typ": "Armor", "ilosc": 8 }, { "typ": "Fly", "ilosc": 10 }, { "typ": "Boss", "ilosc": 2 }] },
      { "odstep": 0.4, "bonus": 60, "wrogowie": [{ "typ": "Fast", "ilosc": 26 }, { "typ": "Fly", "ilosc": 14 }] },
      { "odstep": 0.4, "bonus": 65, "wrogowie": [{ "typ": "Armor", "ilosc": 14 }, { "typ": "Fast", "ilosc": 16 }] },
      { "odstep": 0.38, "bonus": 70, "wrogowie": [{ "typ": "Normal", "ilosc": 24 }, { "typ": "Armor", "ilosc": 10 }, { "typ": "Fly", "ilosc": 16 }] },
      { "odstep": 0.35, "bonus": 80, "wrogowie": [{ "typ": "Fast", "ilosc": 24 }, { "typ": "Armor", "ilosc": 12 }, { "typ": "Fly", "ilosc": 16 }] },
      { "odstep": 0.35, "bonus": 250, "wrogowie": [{ "typ": "Fast", "ilosc": 20 }, { "typ": "Armor", "ilosc": 14 }, { "typ": "Fly", "ilosc": 16 }, { "typ": "Boss", "ilosc": 3 }] }
    ]
  }
};