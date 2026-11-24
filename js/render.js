const KOLORY_ZASTEPCZE = {
  0: "#3a7d44",
  1: "#c2b280",
  2: "#6c757d",
  3: "#2b9348",
  4: "#d90429"
};

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.hoveredTile = null;
    this.selectedTile = null;
    this.podgladZasieguSklepu = null;
    this.cacheObrazkow = {};
    this.cacheSrodkowGif = {};
    this.cacheGifow = {};
    this.elementyGif = new Map();

    this.warstwaGif = this.utworzWarstweGif();
  }

  utworzWarstweGif() {
    const rodzic = this.canvas.parentElement;
    const kontener = document.createElement("div");
    kontener.style.position = "relative";
    kontener.style.display = "inline-block";
    kontener.style.lineHeight = "0";

    rodzic.insertBefore(kontener, this.canvas);
    kontener.appendChild(this.canvas);

    const nakladka = document.createElement("div");
    nakladka.style.position = "absolute";
    nakladka.style.top = "0";
    nakladka.style.left = "0";
    nakladka.style.width = "100%";
    nakladka.style.height = "100%";
    nakladka.style.pointerEvents = "none";
    nakladka.style.overflow = "hidden";

    kontener.appendChild(nakladka);
    return nakladka;
  }

  obliczKorekteSrodka(sciezka, img) {
    if (this.cacheSrodkowGif[sciezka]) {
      return this.cacheSrodkowGif[sciezka];
    }

    const domyslne = { przesuniecieX: -50, przesuniecieY: -50 };

    if (window.location.protocol === "file:") {
      this.cacheSrodkowGif[sciezka] = domyslne;
      return domyslne;
    }

    const szer = img.naturalWidth;
    const wys = img.naturalHeight;

    if (!szer || !wys) {
      this.cacheSrodkowGif[sciezka] = domyslne;
      return domyslne;
    }

    try {
      const pomocniczyCanvas = document.createElement("canvas");
      pomocniczyCanvas.width = szer;
      pomocniczyCanvas.height = wys;
      const pCtx = pomocniczyCanvas.getContext("2d");
      pCtx.drawImage(img, 0, 0);

      const dane = pCtx.getImageData(0, 0, szer, wys).data;
      let minX = szer;
      let minY = wys;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < wys; y++) {
        for (let x = 0; x < szer; x++) {
          const alfa = dane[(y * szer + x) * 4 + 3];
          if (alfa > 10) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (maxX >= minX && maxY >= minY) {
        const srodekZawartosciX = (minX + maxX + 1) / 2;
        const srodekZawartosciY = (minY + maxY + 1) / 2;
        const wynik = {
          przesuniecieX: -(srodekZawartosciX / szer) * 100,
          przesuniecieY: -(srodekZawartosciY / wys) * 100
        };
        this.cacheSrodkowGif[sciezka] = wynik;
        return wynik;
      }
    } catch {
      // Ignoruj ograniczenia CORS dla lokalnych plików
    }

    this.cacheSrodkowGif[sciezka] = domyslne;
    return domyslne;
  }

  wyczyscGify() {
    for (const wpis of this.elementyGif.values()) {
      wpis.img.remove();
    }
    this.elementyGif.clear();
  }
  pobierzZcacheowanyGif(sciezka) {
    if (!this.cacheGifow[sciezka]) {
      const bazowyImg = new Image();
      const wpisCache = { img: bazowyImg, gotowy: false, blad: false, korekta: { przesuniecieX: -50, przesuniecieY: -50 } };
      this.cacheGifow[sciezka] = wpisCache;

      bazowyImg.onload = () => {
        wpisCache.korekta = this.obliczKorekteSrodka(sciezka, bazowyImg);
        wpisCache.gotowy = true;
      };
      bazowyImg.onerror = () => {
        wpisCache.blad = true;
      };
      bazowyImg.src = sciezka;

      if (bazowyImg.complete && bazowyImg.naturalWidth > 0) {
        wpisCache.korekta = this.obliczKorekteSrodka(sciezka, bazowyImg);
        wpisCache.gotowy = true;
      }
    }
    return this.cacheGifow[sciezka];
  }

  aktualizujElementGif(obiekt, sciezka, srodekX, srodekY, szerokosc, wysokosc, zIndex = "1", filtr = "none") {
    const czyGif = sciezka && sciezka.toLowerCase().endsWith(".gif");

    if (!czyGif) {
      const stary = this.elementyGif.get(obiekt);
      if (stary) {
        stary.img.remove();
        this.elementyGif.delete(obiekt);
      }
      return false;
    }

    const zrodlo = this.pobierzZcacheowanyGif(sciezka);
    if (!zrodlo.gotowy || zrodlo.blad) {
      return false;
    }

    let wpis = this.elementyGif.get(obiekt);
    if (!wpis) {
      const img = zrodlo.img.cloneNode();
      img.alt = obiekt.nazwa || "";
      img.style.position = "absolute";
      img.style.imageRendering = "pixelated";
      img.style.pointerEvents = "none";

      wpis = { img, sciezka };
      this.warstwaGif.appendChild(img);
      this.elementyGif.set(obiekt, wpis);
    } else if (wpis.sciezka !== sciezka) {
      wpis.sciezka = sciezka;
      wpis.img.src = sciezka;
      if (!wpis.img.parentElement) {
        this.warstwaGif.appendChild(wpis.img);
      }
    }

    const { przesuniecieX, przesuniecieY } = zrodlo.korekta;
    const procentX = (srodekX / this.canvas.width) * 100;
    const procentY = (srodekY / this.canvas.height) * 100;
    const procentSzer = (szerokosc / this.canvas.width) * 100;
    const procentWys = (wysokosc / this.canvas.height) * 100;

    wpis.img.style.left = `${procentX}%`;
    wpis.img.style.top = `${procentY}%`;
    wpis.img.style.width = `${procentSzer}%`;
    wpis.img.style.height = `${procentWys}%`;
    wpis.img.style.zIndex = zIndex;
    wpis.img.style.filter = filtr;
    wpis.img.style.transformOrigin = `${-przesuniecieX}% ${-przesuniecieY}%`;
    wpis.img.style.transform = `translate(${przesuniecieX}%, ${przesuniecieY}%)`;

    return true;
  }
  aktualizujElementGif(obiekt, sciezka, srodekX, srodekY, szerokosc, wysokosc, zIndex = "1", filtr = "none") {
    const czyGif = sciezka && sciezka.toLowerCase().endsWith(".gif");

    if (!czyGif) {
      const stary = this.elementyGif.get(obiekt);
      if (stary) {
        stary.img.remove();
        this.elementyGif.delete(obiekt);
      }
      return false;
    }

    const zrodlo = this.pobierzZcacheowanyGif(sciezka);
    if (!zrodlo.gotowy || zrodlo.blad) {
      return false;
    }

    let wpis = this.elementyGif.get(obiekt);
    if (!wpis) {
      const img = zrodlo.img.cloneNode();
      img.alt = obiekt.nazwa || "";
      img.style.position = "absolute";
      img.style.imageRendering = "pixelated";
      img.style.pointerEvents = "none";

      wpis = { img, sciezka };
      this.warstwaGif.appendChild(img);
      this.elementyGif.set(obiekt, wpis);
    } else if (wpis.sciezka !== sciezka) {
      wpis.sciezka = sciezka;
      wpis.img.src = sciezka;
      if (!wpis.img.parentElement) {
        this.warstwaGif.appendChild(wpis.img);
      }
    }

    const { przesuniecieX, przesuniecieY } = zrodlo.korekta;
    const procentX = (srodekX / this.canvas.width) * 100;
    const procentY = (srodekY / this.canvas.height) * 100;
    const procentSzer = (szerokosc / this.canvas.width) * 100;
    const procentWys = (wysokosc / this.canvas.height) * 100;

    wpis.img.style.left = `${procentX}%`;
    wpis.img.style.top = `${procentY}%`;
    wpis.img.style.width = `${procentSzer}%`;
    wpis.img.style.height = `${procentWys}%`;
    wpis.img.style.zIndex = zIndex;
    wpis.img.style.filter = filtr;
    wpis.img.style.transformOrigin = `${-przesuniecieX}% ${-przesuniecieY}%`;
    wpis.img.style.transform = `translate(${przesuniecieX}%, ${przesuniecieY}%)`;

    return true;
  }

  pobierzObrazek(sciezka) {
    if (!sciezka) return null;

    if (!this.cacheObrazkow[sciezka]) {
      const img = new Image();
      const wpis = { img, gotowy: false, blad: false };
      this.cacheObrazkow[sciezka] = wpis;

      img.onload = () => {
        wpis.gotowy = true;
      };
      img.onerror = () => {
        wpis.blad = true;
      };
      img.src = sciezka;

      if (img.complete && img.naturalWidth > 0) {
        wpis.gotowy = true;
      }
    }

    const wpis = this.cacheObrazkow[sciezka];
    return wpis.gotowy && !wpis.blad ? wpis.img : null;
  }

  RozmiarDoMapy(map) {
    this.canvas.width = map.grid[0].length * map.RozmiarMap;
    this.canvas.height = map.grid.length * map.RozmiarMap;
    this.wyczyscGify();
  }

  RysujMape(map, wieze = [], przeciwnicy = [], pociski = []) {
    const size = map.RozmiarMap;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < map.grid.length; y++) {
      for (let x = 0; x < map.grid[y].length; x++) {
        const typ = map.grid[y][x];
        const texSrc = map.textureGrid[y][x];
        const img = texSrc ? map.loadedImages[texSrc] : null;

        if (img) {
          this.ctx.drawImage(img, x * size, y * size, size, size);
        } else {
          this.ctx.fillStyle = KOLORY_ZASTEPCZE[typ] || "#000";
          this.ctx.fillRect(x * size, y * size, size, size);
        }

        if (
          this.hoveredTile &&
          this.hoveredTile.x === x &&
          this.hoveredTile.y === y &&
          typ === 2
        ) {
          this.ctx.strokeStyle = "#f10404";
          this.ctx.lineWidth = 4;
          this.ctx.strokeRect(x * size + 2, y * size + 2, size - 4, size - 4);
        }

        if (
          this.selectedTile &&
          this.selectedTile.x === x &&
          this.selectedTile.y === y
        ) {
          this.ctx.strokeStyle = "#e0a832";
          this.ctx.lineWidth = 4;
          this.ctx.strokeRect(x * size + 2, y * size + 2, size - 4, size - 4);
        }
      }
    }

    const aktywneObiekty = new Set([...wieze, ...przeciwnicy]);
    for (const [obiekt, wpis] of this.elementyGif.entries()) {
      if (!aktywneObiekty.has(obiekt)) {
        wpis.img.remove();
        this.elementyGif.delete(obiekt);
      }
    }

    for (const wieza of wieze) {
      this.rysujWieze(wieza, size);
    }

    for (const wrog of przeciwnicy) {
      if (!wrog.czyLatajacy) {
        this.rysujPrzeciwnika(wrog, size);
      }
    }

    for (const wrog of przeciwnicy) {
      if (wrog.czyLatajacy) {
        this.rysujPrzeciwnika(wrog, size);
      }
    }

    for (const pocisk of pociski) {
      this.rysujPocisk(pocisk, size);
    }

    if (this.selectedTile) {
      const wybranaWieza = wieze.find(
        w => w.kafelekX === this.selectedTile.x && w.kafelekY === this.selectedTile.y
      );
      if (wybranaWieza) {
        this.rysujZasieg(wybranaWieza.kafelekX, wybranaWieza.kafelekY, wybranaWieza.zasieg, size, "rgba(224, 168, 50, 0.14)", "rgba(224, 168, 50, 0.8)");
      } else if (this.podgladZasieguSklepu) {
        this.rysujZasieg(this.selectedTile.x, this.selectedTile.y, this.podgladZasieguSklepu, size, "rgba(112, 163, 62, 0.16)", "rgba(112, 163, 62, 0.85)");
      }
    }
  }

  rysujWieze(wieza, size) {
    const srodekX = (wieza.kafelekX + 0.5) * size;
    const srodekY = (wieza.kafelekY + 0.5) * size;

    if (wieza.aktualnyCel) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.setLineDash([4, 6]);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "rgba(239, 68, 68, 0.55)";
      this.ctx.moveTo(srodekX, srodekY);
      this.ctx.lineTo(wieza.aktualnyCel.x, wieza.aktualnyCel.y);
      this.ctx.stroke();
      this.ctx.restore();
    }

    const narysowanoGif = this.aktualizujElementGif(
      wieza,
      wieza.tekstura,
      srodekX,
      srodekY,
      size,
      size,
      "1"
    );

    if (!narysowanoGif) {
      const obrazek = this.pobierzObrazek(wieza.tekstura);

      if (obrazek) {
        this.ctx.drawImage(
          obrazek,
          srodekX - size / 2,
          srodekY - size / 2,
          size,
          size
        );
      } else {
        const promien = size * 0.34;
        this.ctx.fillStyle = wieza.kolor;
        this.ctx.beginPath();
        this.ctx.arc(srodekX, srodekY, promien, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#0e100d";
        this.ctx.stroke();
      }
    }

    if (wieza.poziom > 0) {
      this.ctx.fillStyle = "#e0a832";
      for (let i = 0; i < wieza.poziom; i++) {
        this.ctx.beginPath();
        this.ctx.arc(
          srodekX - 6 + i * 12,
          srodekY + size * 0.36,
          3.5,
          0,
          Math.PI * 2
        );
        this.ctx.fill();
      }
    }
  }

  rysujPrzeciwnika(wrog, size) {
    const skala = wrog.typId === "Boss" ? 0.95 : 0.75;
    const wymiar = size * skala;
    const zIndex = wrog.czyLatajacy ? "3" : "2";
    const filtr = wrog.wartoscSpowolnienia > 0 ? "drop-shadow(0 0 4px #38bdf8)" : "none";

    const narysowanoGif = this.aktualizujElementGif(
      wrog,
      wrog.tekstura,
      wrog.x,
      wrog.y,
      wymiar,
      wymiar,
      zIndex,
      filtr
    );

    if (!narysowanoGif) {
      const obrazek = this.pobierzObrazek(wrog.tekstura);

      if (obrazek) {
        this.ctx.drawImage(
          obrazek,
          wrog.x - wymiar / 2,
          wrog.y - wymiar / 2,
          wymiar,
          wymiar
        );
      } else {
        const promien = wymiar * 0.45;
        this.ctx.fillStyle = wrog.kolor;
        this.ctx.beginPath();
        if (wrog.czyLatajacy) {
          this.ctx.moveTo(wrog.x, wrog.y - promien);
          this.ctx.lineTo(wrog.x + promien, wrog.y + promien);
          this.ctx.lineTo(wrog.x - promien, wrog.y + promien);
          this.ctx.closePath();
        } else {
          this.ctx.arc(wrog.x, wrog.y, promien, 0, Math.PI * 2);
        }
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = wrog.wartoscSpowolnienia > 0 ? "#38bdf8" : "#0e100d";
        this.ctx.stroke();
      }
    }

    const szerokoscPaska = size * (wrog.typId === "Boss" ? 0.8 : 0.55);
    const wysokoscPaska = 5;
    const pasekX = wrog.x - szerokoscPaska / 2;
    const pasekY = wrog.y - wymiar * 0.55 - 6;
    const ulamekHp = Math.max(0, wrog.hp / wrog.maksHp);

    this.ctx.fillStyle = "#0e100d";
    this.ctx.fillRect(pasekX - 1, pasekY - 1, szerokoscPaska + 2, wysokoscPaska + 2);

    this.ctx.fillStyle = ulamekHp > 0.5 ? "#22c55e" : ulamekHp > 0.25 ? "#eab308" : "#ef4444";
    this.ctx.fillRect(pasekX, pasekY, szerokoscPaska * ulamekHp, wysokoscPaska);
  }

  rysujPocisk(pocisk, size) {
    const obrazek = this.pobierzObrazek(pocisk.tekstura);

    if (obrazek) {
      const rozmiarPocisku = size * 0.35;
      this.ctx.save();
      this.ctx.translate(pocisk.x, pocisk.y);
      this.ctx.rotate((pocisk.kat || 0) + Math.PI / 2);
      this.ctx.drawImage(
        obrazek,
        -rozmiarPocisku / 2,
        -rozmiarPocisku / 2,
        rozmiarPocisku,
        rozmiarPocisku
      );
      this.ctx.restore();
    } else {
      this.ctx.fillStyle = pocisk.kolor || "#facc15";
      this.ctx.beginPath();
      this.ctx.arc(pocisk.x, pocisk.y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  rysujZasieg(kafelekX, kafelekY, zasieg, size, wypelnienie, obrys) {
    const srodekX = (kafelekX + 0.5) * size;
    const srodekY = (kafelekY + 0.5) * size;
    const promienPx = zasieg * size;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(srodekX, srodekY, promienPx, 0, Math.PI * 2);
    this.ctx.fillStyle = wypelnienie;
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = obrys;
    this.ctx.stroke();
    this.ctx.restore();
  }
}