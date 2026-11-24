async function wczytajKonfiguracjeWiez(url = "data/wieze.json") {
  return wczytajJsonZFallbackiem(url);
}

class Wieza {
  constructor(konfig, kafelekX, kafelekY) {
    this.typId = konfig.id;
    this.nazwa = konfig.nazwa;
    this.kafelekX = kafelekX;
    this.kafelekY = kafelekY;

    this.poziom = 0;
    this.wydaneZloto = konfig.koszt;
    this.ulepszenia = konfig.ulepszenia || [];

    this.obrazenia = konfig.obrazenia;
    this.szybkoscStrzalu = konfig.szybkoscStrzalu;
    this.zasieg = konfig.zasieg;
    this.celujeWLatajace = konfig.trafialatajacych !== undefined
  ? Boolean(konfig.trafialatajacych)
  : Boolean(konfig.celujeWLatajace);
    this.zasiegObszarowy = konfig.zasiegObszarowy;
    this.spowolnienie = konfig.spowolnienie;
    this.czasSpowolnienia = konfig.czasSpowolnienia;
    this.przebijaPancerz = false;

    this.kolor = konfig.kolor;
    this.tekstura = konfig.tekstura;
    this.teksturaPocisku = konfig.teksturaPocisku;

    this.czasDoStrzalu = 0;
    this.katObrotu = 0;
    this.aktualnyCel = null;
  }

  pobierzNastepneUlepszenie() {
    if (this.poziom >= this.ulepszenia.length) return null;
    return this.ulepszenia[this.poziom];
  }

  ulepsz() {
    const nastepne = this.pobierzNastepneUlepszenie();
    if (!nastepne) return false;

    this.wydaneZloto += nastepne.koszt;
    this.poziom += 1;

    if (nastepne.obrazenia !== undefined) this.obrazenia = nastepne.obrazenia;
    if (nastepne.szybkoscStrzalu !== undefined) this.szybkoscStrzalu = nastepne.szybkoscStrzalu;
    if (nastepne.zasieg !== undefined) this.zasieg = nastepne.zasieg;
    if (nastepne.zasiegObszarowy !== undefined) this.zasiegObszarowy = nastepne.zasiegObszarowy;
    if (nastepne.spowolnienie !== undefined) this.spowolnienie = nastepne.spowolnienie;
    if (nastepne.czasSpowolnienia !== undefined) this.czasSpowolnienia = nastepne.czasSpowolnienia;
    if (nastepne.przebijaPancerz !== undefined) this.przebijaPancerz = nastepne.przebijaPancerz;
    if (nastepne.tekstura !== undefined) this.tekstura = nastepne.tekstura;

    return true;
  }

  pobierzWartoscSprzedazy() {
    return Math.floor(this.wydaneZloto * 0.7);
  }

  znajdzCel(przeciwnicy, rozmiarKafelka) {
    const srodekX = (this.kafelekX + 0.5) * rozmiarKafelka;
    const srodekY = (this.kafelekY + 0.5) * rozmiarKafelka;
    const zasiegPx = this.zasieg * rozmiarKafelka;

    let wybranyCel = null;
    let najwiekszyPostep = -1;

    for (const wrog of przeciwnicy) {
      if (wrog.czyMartwy || wrog.dotarlDoBazy) continue;
      if (wrog.czyLatajacy && !this.celujeWLatajace) continue;

      const dystans = Math.hypot(wrog.x - srodekX, wrog.y - srodekY);
      if (dystans <= zasiegPx && wrog.przebytyDystans > najwiekszyPostep) {
        najwiekszyPostep = wrog.przebytyDystans;
        wybranyCel = wrog;
      }
    }

    return wybranyCel;
  }

  aktualizuj(deltaTime, przeciwnicy, rozmiarKafelka, naStrzal) {
    if (this.czasDoStrzalu > 0) {
      this.czasDoStrzalu -= deltaTime;
    }

    const cel = this.znajdzCel(przeciwnicy, rozmiarKafelka);
    this.aktualnyCel = cel;

    if (!cel) return;

    const srodekX = (this.kafelekX + 0.5) * rozmiarKafelka;
    const srodekY = (this.kafelekY + 0.5) * rozmiarKafelka;
    this.katObrotu = Math.atan2(cel.y - srodekY, cel.x - srodekX);

    if (this.czasDoStrzalu <= 0) {
      this.czasDoStrzalu = 1 / this.szybkoscStrzalu;
      if (naStrzal) {
        naStrzal(this, cel);
      }
    }
  }
}