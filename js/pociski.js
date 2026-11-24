class Pocisk {
  constructor(wieza, cel, rozmiarKafelka) {
    this.x = (wieza.kafelekX + 0.5) * rozmiarKafelka;
    this.y = (wieza.kafelekY + 0.5) * rozmiarKafelka;
    this.cel = cel;

    this.typWiezy = wieza.typId;
    this.obrazenia = wieza.obrazenia;
    this.zasiegObszarowy = wieza.zasiegObszarowy || 0;
    this.spowolnienie = wieza.spowolnienie || 0;
    this.czasSpowolnienia = wieza.czasSpowolnienia || 0;
    this.przebijaPancerz = Boolean(wieza.przebijaPancerz);

    this.tekstura = wieza.teksturaPocisku || null;
    this.kolor = wieza.kolor || "#facc15";
    this.predkoscPx = 8.5 * rozmiarKafelka;
    this.kat = 0;
    this.aktywny = true;
  }

  aktualizuj(deltaTime, przeciwnicy, rozmiarKafelka) {
    if (!this.aktywny) return [];

    if (!this.cel || this.cel.czyMartwy || this.cel.dotarlDoBazy) {
      this.aktywny = false;
      return [];
    }

    const dx = this.cel.x - this.x;
    const dy = this.cel.y - this.y;
    const dystans = Math.hypot(dx, dy);
    const krok = this.predkoscPx * deltaTime;

    this.kat = Math.atan2(dy, dx);

    if (dystans <= krok || dystans < 6) {
      this.x = this.cel.x;
      this.y = this.cel.y;
      this.aktywny = false;
      return this.wybuchnij(przeciwnicy, rozmiarKafelka);
    }

    this.x += (dx / dystans) * krok;
    this.y += (dy / dystans) * krok;
    return [];
  }

  wybuchnij(przeciwnicy, rozmiarKafelka) {
    const zabici = [];

    if (this.zasiegObszarowy > 0) {
      const promienPx = this.zasiegObszarowy * rozmiarKafelka;
      for (const wrog of przeciwnicy) {
        if (wrog.czyMartwy || wrog.dotarlDoBazy || wrog.czyLatajacy) continue;

        const odl = Math.hypot(wrog.x - this.x, wrog.y - this.y);
        if (odl <= promienPx) {
          if (wrog.otrzymajObrazenia(this.obrazenia, this.typWiezy, this.przebijaPancerz)) {
            zabici.push(wrog);
          }
          if (this.spowolnienie > 0) {
            wrog.nalozSpowolnienie(this.spowolnienie, this.czasSpowolnienia);
          }
        }
      }
    } else {
      if (this.cel.otrzymajObrazenia(this.obrazenia, this.typWiezy, this.przebijaPancerz)) {
        zabici.push(this.cel);
      }
      if (this.spowolnienie > 0) {
        this.cel.nalozSpowolnienie(this.spowolnienie, this.czasSpowolnienia);
      }
    }

    return zabici;
  }
}