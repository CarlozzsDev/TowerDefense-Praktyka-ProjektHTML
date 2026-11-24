class Dzwieki {
  constructor(sciezkaMuzyki = "data/audio/muzyka.mp3") {
    this.kontekst = null;
    this.wyciszony = localStorage.getItem("td_wyciszenie") === "true";

    const zapisanaMuzyka = localStorage.getItem("td_glosnosc_muzyki");
    const zapisaneEfekty = localStorage.getItem("td_glosnosc_efektow");

    this.glosnoscMuzyki = zapisanaMuzyka !== null ? Number(zapisanaMuzyka) : 0.25;
    this.glosnoscEfektow = zapisaneEfekty !== null ? Number(zapisaneEfekty) : 0.8;

    this.muzyka = new Audio(sciezkaMuzyki);
    this.muzyka.loop = true;
    this.muzyka.volume = this.glosnoscMuzyki;
    this.muzyka.muted = this.wyciszony;
    this.czyMuzykaMaGrac = false;
  }

  ustawGlosnoscMuzyki(wartosc) {
    this.glosnoscMuzyki = Math.max(0, Math.min(1, wartosc));
    localStorage.setItem("td_glosnosc_muzyki", String(this.glosnoscMuzyki));
    this.muzyka.volume = this.glosnoscMuzyki;

    if (this.glosnoscMuzyki > 0 && !this.wyciszony && this.czyMuzykaMaGrac && this.muzyka.paused) {
      this.muzyka.play().catch(() => {});
    }
  }

  ustawGlosnoscEfektow(wartosc) {
    this.glosnoscEfektow = Math.max(0, Math.min(1, wartosc));
    localStorage.setItem("td_glosnosc_efektow", String(this.glosnoscEfektow));
  }

  ustawMuzyke(sciezkaMuzyki) {
    const grala = this.czyMuzykaMaGrac;
    this.muzyka.pause();
    this.muzyka.src = sciezkaMuzyki;
    this.muzyka.load();
    if (grala && !this.wyciszony) {
      this.muzyka.play().catch(() => {});
    }
  }

  startMuzyki() {
    this.czyMuzykaMaGrac = true;
    this.muzyka.volume = this.glosnoscMuzyki;
    this.muzyka.muted = this.wyciszony;
    if (!this.wyciszony && this.glosnoscMuzyki > 0) {
      this.muzyka.play().catch(() => {});
    }
  }

  pauzaMuzyki() {
    this.muzyka.pause();
  }

  wznowMuzyke() {
    if (this.czyMuzykaMaGrac && !this.wyciszony && this.glosnoscMuzyki > 0) {
      this.muzyka.play().catch(() => {});
    }
  }

  stopMuzyki() {
    this.czyMuzykaMaGrac = false;
    this.muzyka.pause();
    this.muzyka.currentTime = 0;
  }

  inicjalizuj() {
    if (!this.kontekst) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.kontekst = new AudioCtx();
      }
    }
    if (this.kontekst && this.kontekst.state === "suspended") {
      this.kontekst.resume();
    }
    if (this.czyMuzykaMaGrac && !this.wyciszony && this.glosnoscMuzyki > 0 && this.muzyka.paused) {
      this.muzyka.play().catch(() => {});
    }
  }

  przelaczWyciszenie() {
    this.wyciszony = !this.wyciszony;
    localStorage.setItem("td_wyciszenie", String(this.wyciszony));
    this.muzyka.muted = this.wyciszony;

    if (this.wyciszony) {
      this.muzyka.pause();
    } else if (this.czyMuzykaMaGrac && this.glosnoscMuzyki > 0) {
      this.muzyka.play().catch(() => {});
    }

    return this.wyciszony;
  }

  grajTon(czestotliwoscStart, czestotliwoscKoniec, czasTrwania, typFali = "square", glosnoscBazowa = 0.08) {
    if (this.wyciszony || this.glosnoscEfektow <= 0) return;
    this.inicjalizuj();
    if (!this.kontekst) return;

    const finalnaGlosnosc = Math.max(0.001, glosnoscBazowa * this.glosnoscEfektow);
    const teraz = this.kontekst.currentTime;
    const oscylator = this.kontekst.createOscillator();
    const wzmocnienie = this.kontekst.createGain();

    oscylator.type = typFali;
    oscylator.frequency.setValueAtTime(czestotliwoscStart, teraz);
    oscylator.frequency.exponentialRampToValueAtTime(
      Math.max(20, czestotliwoscKoniec),
      teraz + czasTrwania
    );

    wzmocnienie.gain.setValueAtTime(finalnaGlosnosc, teraz);
    wzmocnienie.gain.exponentialRampToValueAtTime(0.0005, teraz + czasTrwania);

    oscylator.connect(wzmocnienie);
    wzmocnienie.connect(this.kontekst.destination);

    oscylator.start(teraz);
    oscylator.stop(teraz + czasTrwania);
  }

  grajStrzal(typWiezy) {
    if (typWiezy === "Snajper") {
      this.grajTon(620, 110, 0.16, "sawtooth", 0.09);
    } else if (typWiezy === "Heavy") {
      this.grajTon(220, 55, 0.22, "triangle", 0.12);
    } else if (typWiezy === "Slow") {
      this.grajTon(780, 420, 0.12, "sine", 0.07);
    } else {
      this.grajTon(480, 190, 0.08, "square", 0.06);
    }
  }

  grajTrafienie() {
    this.grajTon(160, 75, 0.06, "triangle", 0.05);
  }

  grajKoniecFali() {
    this.grajTon(330, 440, 0.12, "triangle", 0.08);
    setTimeout(() => this.grajTon(440, 660, 0.18, "triangle", 0.08), 110);
  }

  grajKoniecGry(czyWygrana) {
    if (czyWygrana) {
      this.grajTon(392, 523, 0.15, "triangle", 0.1);
      setTimeout(() => this.grajTon(523, 659, 0.15, "triangle", 0.1), 140);
      setTimeout(() => this.grajTon(659, 784, 0.28, "triangle", 0.1), 280);
    } else {
      this.grajTon(300, 180, 0.2, "sawtooth", 0.09);
      setTimeout(() => this.grajTon(180, 95, 0.35, "sawtooth", 0.09), 190);
    }
  }
}