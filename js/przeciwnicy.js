async function wczytajKonfiguracjePrzeciwnikow(url = "data/przeciwnicy.json") {
  return wczytajJsonZFallbackiem(url);
}

class Przeciwnik {
  constructor(konfig, punktySciezki, rozmiarKafelka) {
    this.typId = konfig.id;
    this.nazwa = konfig.nazwa;
    this.maksHp = konfig.hp;
    this.hp = konfig.hp;
    this.predkoscBazowa = konfig.predkosc;
    this.nagroda = konfig.nagroda;
    this.obrazeniaBazy = konfig.obrazeniaBazy;

    this.czyLatajacy = Boolean(konfig.czyLatajacy);
    this.odpornoscNaSpowolnienie = Boolean(konfig.odpornoscNaSpowolnienie);
    this.odpornoscStandard = konfig.odpornoscStandard !== undefined ? konfig.odpornoscStandard : 1.0;

    this.kolor = konfig.kolor || "#e63946";
    this.tekstura = konfig.tekstura || null;

    this.rozmiarKafelka = rozmiarKafelka;
    this.trasa = this.czyLatajacy
      ? [punktySciezki[0], punktySciezki[punktySciezki.length - 1]]
      : punktySciezki;

    this.indeksCelu = 1;
    this.x = (this.trasa[0].x + 0.5) * rozmiarKafelka;
    this.y = (this.trasa[0].y + 0.5) * rozmiarKafelka;

    this.przebytyDystans = 0;
    this.katObrotu = 0;

    this.wartoscSpowolnienia = 0;
    this.pozostalyCzasSpowolnienia = 0;

    this.czyMartwy = false;
    this.dotarlDoBazy = false;
  }

  nalozSpowolnienie(procent, czas) {
    if (this.odpornoscNaSpowolnienie || procent <= 0 || czas <= 0) return;

    if (procent >= this.wartoscSpowolnienia) {
      this.wartoscSpowolnienia = procent;
      this.pozostalyCzasSpowolnienia = czas;
    } else if (procent === this.wartoscSpowolnienia) {
      this.pozostalyCzasSpowolnienia = Math.max(this.pozostalyCzasSpowolnienia, czas);
    }
  }

  otrzymajObrazenia(ilosc, typWiezy, przebijaPancerz = false) {
    if (this.czyMartwy || this.dotarlDoBazy) return false;

    let finalneObrazenia = ilosc;
    if (typWiezy === "Standard" && !przebijaPancerz) {
      finalneObrazenia *= this.odpornoscStandard;
    }

    this.hp -= finalneObrazenia;
    if (this.hp <= 0) {
      this.hp = 0;
      this.czyMartwy = true;
      return true;
    }
    return false;
  }

  aktualizuj(deltaTime) {
    if (this.czyMartwy || this.dotarlDoBazy) return;

    if (this.pozostalyCzasSpowolnienia > 0) {
      this.pozostalyCzasSpowolnienia -= deltaTime;
      if (this.pozostalyCzasSpowolnienia <= 0) {
        this.pozostalyCzasSpowolnienia = 0;
        this.wartoscSpowolnienia = 0;
      }
    }

    const aktualnaPredkoscPx =
      this.predkoscBazowa * (1 - this.wartoscSpowolnienia) * this.rozmiarKafelka;
    let dystansDoPrzejscia = aktualnaPredkoscPx * deltaTime;

    while (dystansDoPrzejscia > 0 && this.indeksCelu < this.trasa.length) {
      const celKafelek = this.trasa[this.indeksCelu];
      const celX = (celKafelek.x + 0.5) * this.rozmiarKafelka;
      const celY = (celKafelek.y + 0.5) * this.rozmiarKafelka;

      const dx = celX - this.x;
      const dy = celY - this.y;
      const odleglosc = Math.hypot(dx, dy);

      if (odleglosc <= dystansDoPrzejscia) {
        this.x = celX;
        this.y = celY;
        this.przebytyDystans += odleglosc;
        dystansDoPrzejscia -= odleglosc;
        this.indeksCelu += 1;

        if (this.indeksCelu >= this.trasa.length) {
          this.dotarlDoBazy = true;
          return;
        }
      } else {
        this.katObrotu = Math.atan2(dy, dx);
        this.x += (dx / odleglosc) * dystansDoPrzejscia;
        this.y += (dy / odleglosc) * dystansDoPrzejscia;
        this.przebytyDystans += dystansDoPrzejscia;
        dystansDoPrzejscia = 0;
      }
    }
  }
}