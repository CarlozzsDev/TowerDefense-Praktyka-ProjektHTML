<?php
header("Content-Type: application/json; charset=utf-8");

$plik = __DIR__ . "/data/wyniki_serwer.json";

function wczytajRekordy($plik) {
  if (!file_exists($plik)) {
    return [];
  }
  $zawartosc = file_get_contents($plik);
  $dane = json_decode($zawartosc, true);
  return is_array($dane) ? $dane : [];
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
  $limit = isset($_GET["limit"]) ? max(1, min(500, intval($_GET["limit"]))) : 200;
  $rekordy = wczytajRekordy($plik);

  usort($rekordy, function ($a, $b) {
    return ($b["wynik"] ?? 0) <=> ($a["wynik"] ?? 0);
  });

  echo json_encode(array_slice($rekordy, 0, $limit), JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $body = json_decode(file_get_contents("php://input"), true);

  $gracz = trim((string)($body["gracz"] ?? ""));
  $mapa = trim((string)($body["mapa"] ?? ""));
  $wynik = isset($body["wynik"]) ? intval($body["wynik"]) : -1;

  $gracz = function_exists("mb_substr") ? mb_substr($gracz, 0, 24) : substr($gracz, 0, 24);
  $mapa = function_exists("mb_substr") ? mb_substr($mapa, 0, 40) : substr($mapa, 0, 40);

  if ($gracz === "" || $mapa === "" || $wynik < 0) {
    http_response_code(400);
    echo json_encode(["blad" => "Nieprawidłowe dane wyniku."], JSON_UNESCAPED_UNICODE);
    exit;
  }

  $katalog = dirname($plik);
  if (!is_dir($katalog)) {
    mkdir($katalog, 0755, true);
  }

  $rekordy = wczytajRekordy($plik);
  $nowyWpis = [
    "gracz" => $gracz,
    "mapa" => $mapa,
    "wynik" => $wynik,
    "data" => date("c")
  ];

  $rekordy[] = $nowyWpis;
  usort($rekordy, function ($a, $b) {
    return ($b["wynik"] ?? 0) <=> ($a["wynik"] ?? 0);
  });

  $rekordy = array_slice($rekordy, 0, 500);

  $zapisano = file_put_contents(
    $plik,
    json_encode($rekordy, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
    LOCK_EX
  );

  if ($zapisano === false) {
    http_response_code(500);
    echo json_encode(["blad" => "Nie udało się zapisać pliku wyników na serwerze."], JSON_UNESCAPED_UNICODE);
    exit;
  }

  http_response_code(201);
  echo json_encode($nowyWpis, JSON_UNESCAPED_UNICODE);
  exit;
}

http_response_code(405);
echo json_encode(["blad" => "Niedozwolona metoda HTTP."], JSON_UNESCAPED_UNICODE);