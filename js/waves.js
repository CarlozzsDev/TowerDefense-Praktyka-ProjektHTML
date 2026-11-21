class MenadzerFal {
  constructor(fale = []) {
    this.fale = fale;
    this.numerFali = 0;
    this.czyFalaAktywna = false;
    this.czasDoNastepnejFali = 0;
    this.czasPrzerwy = 12;

    this.kolejkaSpawnu = [];
    this.licznikSpawnu = 0;
    this.odstepSpawnu = 1.0;

    this.czyWszystkieFaleUkonczone = false;
  }

  pobierzLiczbeFal() {
    return this.fale.length;
  }

  pobierzAktualnyNumerWyswietlany() {
    if (this.fale.length === 0) return "0/0";
    const wyswietlany = Math.min(Math.max(1, this.numerFali), this.fale.length);
    return `${wyswietlany}/${this.fale.length}`;
  }

  rozpocznijNastepnaFale() {
    if (this.czyFalaAktywna || this.czyWszystkieFaleUkonczone) return false;
    if (this.numerFali >= this.fale.length) {
      this.czyWszystkieFaleUkonczone = true;
      return false;
    }

    const definicjaFali = this.fale[this.numerFali];
    this.numerFali += 1;
    this.czyFalaAktywna = true;
    this.czasDoNastepnejFali = 0;
    this.odstepSpawnu = definicjaFali.odstep || 1.0;
    this.licznikSpawnu = 0;

    this.kolejkaSpawnu = [];
    for (const grupa of definicjaFali.wrogowie) {
      for (let i = 0; i < grupa.ilosc; i++) {
        this.kolejkaSpawnu.push(grupa.typ);
      }
    }

    return true;
  }

  wywolajWczesniej() {
    if (this.czyFalaAktywna || this.czyWszystkieFaleUkonczone) return 0;

    const bonusZlota = this.numerFali === 0
      ? 0
      : Math.max(5, Math.ceil(this.czasDoNastepnejFali * 2));

    const wystartowala = this.rozpocznijNastepnaFale();
    return wystartowala ? bonusZlota : 0;
  }

  aktualizuj(deltaTime, liczbaZywychWrogow, naSpawnWroga, naKoniecFali) {
    if (this.czyWszystkieFaleUkonczone || this.fale.length === 0) return;

    if (!this.czyFalaAktywna) {
      if (this.numerFali === 0) return;

      this.czasDoNastepnejFali -= deltaTime;
      if (this.czasDoNastepnejFali <= 0) {
        this.rozpocznijNastepnaFale();
      }
      return;
    }

    if (this.kolejkaSpawnu.length > 0) {
      this.licznikSpawnu -= deltaTime;
      if (this.licznikSpawnu <= 0) {
        const typWroga = this.kolejkaSpawnu.shift();
        this.licznikSpawnu = this.odstepSpawnu;
        if (naSpawnWroga) {
          naSpawnWroga(typWroga);
        }
      }
    } else if (liczbaZywychWrogow === 0) {
      const ukonczonaFala = this.fale[this.numerFali - 1];
      const bonusZaFale = ukonczonaFala ? (ukonczonaFala.bonus || 0) : 0;

      this.czyFalaAktywna = false;

      if (this.numerFali >= this.fale.length) {
        this.czyWszystkieFaleUkonczone = true;
      } else {
        this.czasDoNastepnejFali = this.czasPrzerwy;
      }

      if (naKoniecFali) {
        naKoniecFali(bonusZaFale, this.czyWszystkieFaleUkonczone);
      }
    }
  }
}