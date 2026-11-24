# Dziennik użycia AI

## 2026-11-21 Pola (UI / Mapy / Storage)

Problem: Po zamknięciu karty przeglądarki tabela najlepszych wyników
resetowała się do zera, a przy próbie zapisu obiektów w `localStorage` pojawiało
się `[object Object]`.
Co spróbowałam sama: Próbowałam zapisywać tablicę wyników bezpośrednio przez
`localStorage.setItem("wyniki", lista)`.
Pytanie do AI: „Jak zapisać tablicę obiektów z wynikami gracza w
`localStorage` w JavaScript, posortować ją od największego wyniku i zostawić tylko
TOP 10?"
Co dostałam: Wyjaśnienie, że `localStorage` obsługuje tylko stringi i trzeba
użyć `JSON.stringify()` oraz `JSON.parse()`, wraz z przykładem sortowania
`.sort((a, b) => b.wynik - a.wynik)` i `.slice(0, 10)`.
Co z tego zrobiłam: Przeniosłam kod do osobnego modułu `storage.js`, dodałam
zabezpieczenie `try...catch` na wypadek uszkodzonych danych w pamięci przeglądarki
oraz podpięłam renderowanie wierszy tabeli w `odswiezTabeleWynikow()`.
Czego się nauczyłam: Jak działa serializacja danych do JSON przy pracy z
pamięcią lokalną przeglądarki.
Czas: 35 min

## 2026-11-21 Mateusz (Tekstury / Dane lokalne)

Problem: Gra działała poprawnie na rozszerzeniu Live Server w VS Code, ale po
otwarciu pliku `index.html` bezpośrednio z dysku (`file://`) wyrzucała błąd
ładowania map i wież przez `fetch()`.
Co spróbowałem sam: Sprawdzałem ścieżki do plików w `data/maps/mapa1.json` i
zmieniałem je ze względnych na bezwzględne, ale konsola nadal zgłaszała blokadę
CORS.
Pytanie do AI: „Dlaczego `fetch('data/wieze.json')` nie działa po otwarciu
`index.html` z dysku bez serwera i jak to obejść bez używania bundlerów?"
Co dostałem: Wyjaśnienie polityki bezpieczeństwa przeglądarek dla protokołu
`file://` oraz propozycję funkcji `wczytajJsonZFallbackiem`, która próbuje pobrać
JSON przez `fetch()`, a w razie niepowodzenia sięga do zapasowego obiektu w pliku
`.js`.
Co z tego zrobiłem: Utworzyłem plik `dane_lokalne.js` z globalnym obiektem
`window.DANE_LOKALNE_TD` oraz zaimplementowałem `wczytajJsonZFallbackiem()` w
`tekstury.js`, z której korzystają wszystkie moduły wczytujące konfigurację.
Czego się nauczyłem: Czym jest polityka CORS przy protokole `file://` i jak
zapewnić działanie aplikacji zarówno na serwerze, jak i lokalnie.
Czas: 50 min

## 2026-11-21 Mateusz (Audio)

Problem: Potrzebowaliśmy różnych dźwięków strzałów dla 4 wież, trafienia i
końca fali, ale nie mieliśmy gotowych plików `.wav` pasujących do klimatu retro, a
przeglądarka blokowała start muzyki przy wejściu na stronę.
Co spróbowałem sam: Dodałem obiekt `new Audio("data/audio/muzyka.mp3")`, ale
konsola zwracała błąd `NotAllowedError` przed pierwszym kliknięciem użytkownika.
Pytanie do AI: „Jak wygenerować proste dźwięki retro strzałów i wybuchów w
czystym JavaScript bez zewnętrznych plików audio oraz jak poprawnie uruchomić
muzykę w tle?"
Co dostałem: Przykład użycia `AudioContext` z Web Audio API (oscylator +
obwiednia głośności `GainNode`) oraz wzorzec odblokowania audio przy pierwszej
interakcji użytkownika.
Co z tego zrobiłem: Napisałem klasę `Dzwieki` w `audio.js` łączącą odtwarzacz
muzyki MP3 z syntezatorem efektów (`grajStrzal`, `grajTrafienie`,
`grajKoniecFali`, `grajKoniecGry`) oraz zapisałem poziomy głośności w
`localStorage`.
Czego się nauczyłem: Jak działa synteza dźwięku w przeglądarce za pomocą fal
dźwiękowych (`square`, `triangle`, `sawtooth`) i dlaczego przeglądarki wymagają
interakcji przed odtworzeniem dźwięku.
Czas: 1 h 10 min

## 2026-11-21 Dawid (Silnik / Pętla gry)

Problem: Po przełączeniu na inną kartę w przeglądarce w trakcie fali i
powrocie do gry wszyscy przeciwnicy natychmiast docierali do bazy i zabierali
wszystkie życia.
Co spróbowałem sam: Próbowałem zatrzymywać grę na zdarzeniu `blur`, ale psuło
to płynność po powrocie do okna.
Pytanie do AI: „Dlaczego moja pętla gry na `requestAnimationFrame` przesuwa
przeciwników o ogromny dystans po powrocie z innej karty przeglądarki?"
Co dostałem: Wyjaśnienie, że `requestAnimationFrame` pauzuje w nieaktywnych
kartach, więc pierwszy `deltaTime` po powrocie wynosi kilka lub kilkanaście
sekund. AI zaproponowało ograniczenie maksymalnego kroku czasu przez
`Math.min(..., 0.1)`.
Co z tego zrobiłem: Zastosowałem ograniczenie `surowyDeltaTime = Math.min((aktualnyCzas - czasOstatniejKlatki) / 1000, 0.1)` w funkcji `petlaGry()`
w `gra.js` i przetestowałem przełączanie kart w trakcie fali.
Czego się nauczyłem: Jak działa `deltaTime` w grach i dlaczego trzeba
zabezpieczać pętlę przed skokami czasu między klatkami.
Czas: 30 min

## 2026-11-22 Dawid (Renderer / Animacje)

Problem: Sprite'y wież i przeciwników zapisane w formacie `.gif` nie animowały
się na planszy – rysowała się tylko ich pierwsza, nieruchoma klatka.
Co spróbowałem sam: Próbowałem przeładowywać `new Image()` w każdej klatce
pętli rysującej na Canvasie, co nie uruchomiło animacji, a jedynie obciążało
przeglądarkę.
None
Pytanie do AI: „Dlaczego `<canvas>` w HTML5 nie odtwarza animowanych plików
GIF i jak wyświetlić animowane sprite'y na siatce gry?"
Co dostałem: Informację, że `ctx.drawImage()` rysuje tylko statyczną klatkę
GIF-a, oraz propozycję utworzenia przezroczystej nakładki HTML (`div`) nad
canvasem, w której animowane obiekty są renderowane jako elementy `<img>`.
Co z tego zrobiłem: Zaimplementowałem w `render.js` metodę
`utworzWarstweGif()` oraz `aktualizujElementGif()`, które pozycjonują sprite'y
procentowo nad canvasem i automatycznie usuwają je z DOM po śmierci wroga lub
sprzedaży wieży.
Czego się nauczyłem: Jak łączyć renderowanie na `<canvas>` z warstwą elementów
DOM i jak synchronizować ich współrzędne podczas skalowania ekranu.
Czas: 1 h 15 min

## 2026-11-22 Pola i Dawid (Balans i system celowania)

Problem: Przy dużych falach wieże strzelały w losowych wrogów z tyłu grupy,
przez co pojedynczy szybki przeciwnik prześlizgiwał się do bazy, a pancerne
jednostki były nie do przebicia bez Snajpera.
Co spróbowałem sam: Zwiększyliśmy bazowe obrażenia wieży Standard, ale wtedy
gra stała się zbyt łatwa i dało się ją przejść samymi najtańszymi wieżami.
Pytanie do AI: „Jak napisać w JavaScript funkcję wyboru celu dla wieży, żeby
zawsze atakowała wroga najbliższego wyjścia, niezależnie od zakrętów na mapie?"
Co dostałem: Pomysł zliczania sumy pokonanych pikseli (`przebytyDystans`) w
klasie przeciwnika i wybierania w wieży celu z najwyższą wartością tej zmiennej.
Co z tego zrobiłem: Dodaliśmy pole `przebytyDystans` w `przeciwnicy.js`,
logikę priorytetu w `Wieza.znajdzCel()` oraz przywróciliśmy pierwotny koszt i
obrażenia wieży Standard w `wieze.json` (wymuszając używanie wież Heavy, Slow i
Snajper z przebiciem pancerza).
Czego się nauczyłem: Dlaczego w grach Tower Defense odległość w linii prostej
do bazy nie sprawdza się na krętych mapach i jak ważny jest balans wymuszający
różnorodność wież.
Czas: 45 min

## 2026-11-22 Dawid (Notatki w kodzie + poprawa ogólna całego kodu dla przejrzystości)

Problem: Częste gubienie się przez zespół w dużej ilości kodu i plików.
Pytanie do AI: "Wyśle ci pliki projektu nad którym pracuje. Twoim zadaniem będzie uzdatnienie kodu oraz dodanie do niego komentarzy celem poprawy pracy zespołu". 
Co dostałem: Poprawiony i bardziej przejrzysty kod z komentarzami.
Czas: 30 min