const MAX_FALA_TRUDNOSCI_ENDLESS = 100;

function wygenerujDefinicjeFaliEndless(numerNowejFali) {
  const efektywnaFala = Math.min(numerNowejFali, MAX_FALA_TRUDNOSCI_ENDLESS);
  const postep = Math.max(0, efektywnaFala - 15) / (MAX_FALA_TRUDNOSCI_ENDLESS - 15);

  const lacznaLiczbaWrogow = Math.min(
    95,
    Math.max(16, Math.round(18 + (efektywnaFala - 15) * 1.15 + (Math.random() * 6 - 3)))
  );

  const pulaZwyklych = ["Normal", "Fast", "Armor", "Fly"];
  const wagi = [
    Math.max(6, 30 - postep * 24),
    24 + postep * 18,
    22 + postep * 30,
    22 + postep * 26
  ];

  const losujTyp = () => {
    const suma = wagi.reduce((acc, w) => acc + w, 0);
    let los = Math.random() * suma;
    for (let i = 0; i < pulaZwyklych.length; i++) {
      los -= wagi[i];
      if (los <= 0) return pulaZwyklych[i];
    }
    return "Armor";
  };

  const wrogowie = [];
  let pozostalo = lacznaLiczbaWrogow;

  if (efektywnaFala % 4 === 0) {
    const liczbaBossow = Math.min(5, 1 + Math.floor(postep * 4));
    wrogowie.push({ typ: "Boss", ilosc: liczbaBossow });
    pozostalo = Math.max(6, pozostalo - liczbaBossow * 4);
  }

  let zabezpieczenie = 0;
  while (pozostalo > 0 && zabezpieczenie < 18) {
    zabezpieczenie += 1;
    const typ = losujTyp();
    const maxGrupy = Math.min(pozostalo, Math.max(3, Math.round(7 + postep * 7)));
    const ilosc = Math.min(
      pozostalo,
      Math.max(1, Math.round((0.4 + Math.random() * 0.6) * maxGrupy))
    );

    const ostatniaGrupa = wrogowie[wrogowie.length - 1];
    if (ostatniaGrupa && ostatniaGrupa.typ === typ) {
      ostatniaGrupa.ilosc += ilosc;
    } else {
      wrogowie.push({ typ, ilosc });
    }
    pozostalo -= ilosc;
  }

  const odstep = Number(
    Math.max(0.16, 0.62 - postep * 0.42 + (Math.random() * 0.1 - 0.05)).toFixed(2)
  );
  const bonus = Math.min(260, Math.round(25 + efektywnaFala * 2));

  return {
    bonus,
    odstep,
    wrogowie
  };
}

class MenadzerFal {
  constructor(fale = [], czyEndless = false) {
    this.fale = Array.isArray(fale) ? [...fale] : [];
    this.czyEndless = Boolean(czyEndless);
    this.numerFali = 0;
    this.czyFalaAktywna = false;
    this.czasDoNastepnejFali = 0;
    this.czasPrzerwy = this.czyEndless ? 9 : 12;

    this.kolejkaSpawnu = [];
    this.licznikSpawnu = 0;
    this.odstepSpawnu = 1.0;

    this.czyWszystkieFaleUkonczone = false;
  }

  pobierzLiczbeFal() {
    return this.czyEndless ? Infinity : this.fale.length;
  }

  pobierzAktualnyNumerWyswietlany() {
    if (this.czyEndless) {
      const wyswietlany = Math.max(1, this.numerFali);
      return `${wyswietlany}/∞`;
    }

    if (this.fale.length === 0) return "0/0";
    const wyswietlany = Math.min(Math.max(1, this.numerFali), this.fale.length);
    return `${wyswietlany}/${this.fale.length}`;
  }

  zapewnijFaleDoIndeksu(indeks) {
    while (this.czyEndless && this.fale.length <= indeks) {
      const numerNowejFali = this.fale.length + 1;
      this.fale.push(wygenerujDefinicjeFaliEndless(numerNowejFali));
    }
  }

  rozpocznijNastepnaFale() {
    if (this.czyFalaAktywna || this.czyWszystkieFaleUkonczone) return false;

    if (this.czyEndless) {
      this.zapewnijFaleDoIndeksu(this.numerFali);
    } else if (this.numerFali >= this.fale.length) {
      this.czyWszystkieFaleUkonczone = true;
      return false;
    }

    const definicjaFali = this.fale[this.numerFali];
    if (!definicjaFali) return false;

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
    if (this.czyWszystkieFaleUkonczone) return;
    if (!this.czyEndless && this.fale.length === 0) return;

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

      if (this.czyEndless) {
        this.zapewnijFaleDoIndeksu(this.numerFali);
        this.czasDoNastepnejFali = Math.max(
          4.5,
          this.czasPrzerwy - Math.min(4.5, Math.floor(Math.max(0, this.numerFali - 15) / 8) * 0.75)
        );
      } else if (this.numerFali >= this.fale.length) {
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