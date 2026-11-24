# Tower Defense – SiDLY Praktyki
Przeglądarkowa gra typu Tower Defense napisana w czystym JavaScript, HTML5 Canvas oraz CSS bez użycia zewnętrznych silników gier ani frameworków. Gracz ma za zadanie obronić bazę przed 15 falami przeciwników na jednej z 3 map o rosnącym poziomie trudności.
---
## Jak uruchomić grę
Gra nie wymaga instalacji ani serwera HTTP:
1. Pobierz lub sklonuj repozytorium na dysk.
2. Otwórz plik `index.html` w dowolnej przeglądarce.
3. (Opcjonalnie) Projekt można również uruchomić przez serwer.
---
## Mechanika gry
### Wieże (4 typy + 2 poziomy ulepszeń)
* Standard (50 zł): Szybki ostrzał pojedynczego celu naziemnego. Zadaje tylko
50% obrażeń jednostkom pancernym.
* Heavy (120 zł): Wolne, ciężkie pociski zadające obrażenia obszarowe (promień
1–1.5 kafelka) celom naziemnym.
* Slow (80 zł): Spowalnia trafionych przeciwników o 30% (po ulepszeniu o 50%)
na 2 sekundy. Atakuje również cele latające.
* Snajper (150 zł): Ogromny zasięg i wysokie obrażenia. Atakuje cele latające,
a na 2. poziomie ulepszenia przebija pancerz.
Każdą wieżę można sprzedać za 70% łącznego kosztu budowy i ulepszeń.
### Przeciwnicy (5 typów)
* Normal: Zbalansowana jednostka podstawowa (40 HP, 1.0 kafelka/s).
* Fast: Niska wytrzymałość, bardzo wysoka prędkość (20 HP, 2.2 kafelka/s).
* Armor: Wysoka wytrzymałość, odporność 50% na wieże Standard (150 HP, 0.6
kafelka/s, zabiera 2 życia).
* Fly: Jednostka powietrzna – ignoruje zakręty i leci w linii prostej do bazy.
* Boss: Pojawia się co 5 fal (1200 HP, odporny na spowolnienie, zabiera 5
żyć).
---
## Kontrakt danych (JSON) – jak dodać nową mapę lub wieżę
>Ważne: Po edycji plików `.json` należy zaktualizować odpowiadający im wpis w
`data/dane_lokalne.js`, aby zmiany były widoczne również przy otwieraniu
`index.html` bezpośrednio z dysku.
### 1. Dodawanie nowej mapy (`data/maps/mapaX.json`)
Plik mapy musi zawierać:
* `id` i `name` – identyfikator oraz nazwa wyświetlana na ekranie końca gry i w
tabeli wyników.
* `RozmiarMap` – rozmiar pojedynczego kafelka w pikselach (domyślnie `64`).
* `grid` – tablica 2D (`12 wierszy × 20 kolumn`) z kodami pól:
* `0` – trawa (dekoracja)
* `1` – droga
* `2` – pole budowy wieży
* `3` – punkt startowy (spawn wrogów)
* `4` – baza gracza
* `punkty` – tablica obiektów `{"x": kolumna, "y": wiersz}` wyznaczająca kolejne
zakręty ścieżki od startu do bazy.
* `fale` – tablica obiektów definiujących kolejne fale (`odstep` w sekundach,
`bonus` złota, tablica `wrogowie` z polami `typ` i `ilosc`).
---
## Podział ról w zespole
* Pola (Projektant UI / Mapy / Zapis): `storage.js`, `style.css`,
`mapa1.json`, `mapa2.json`, `mapa3.json`, pliki graficzne `.gif`/`.png`, widoki
wyboru mapy i tabeli wyników w `index.html`.
* Mateusz (Audio / Zasoby / Mechanika wież): `audio.js`, `tekstury.js`,
`dane_lokalne.js`, `przeciwnicy.json`, `wieze.js`, menu główne oraz bestiariusz w
`index.html`.
* Dawid (Silnik gry / Render / System fal): `gra.js`, `render.js`,
`pociski.js`, `przeciwnicy.js`, `waves.js`, `wieze.json`, ekran rozgrywki i
ekran końca gry w `index.html`.

---
* PS. Przez słabe zapoznanie z GitHubem, podczas pisania kodu wszystkie pliki były wysyłane do Dawida co spowodowało nie wyświetlanie się commitów Poli i Mateusza na stronie. 
* PPS. Wszystkie pull requesty zostały wysłane przez zarówno Pole jak i Mateusza po ukończeniu projektu.
