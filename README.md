# Top5-Movies

Automatyczny generator cotygodniowych filmów wideo **TOP 5 najpopularniejszych filmów tygodnia** (wg TMDB). Budowany w [Remotion](https://remotion.dev), renderowany do MP4 (H.264) przez FFmpeg wbudowany w `@remotion/renderer`.

- Dane zmieniają się co tydzień — **wygląd filmu jest zawsze taki sam** (stały system theme).
- Format podstawowy: **1920x1080, 30 FPS**, z łatwym przełączeniem na **1080x1920**.

## Struktura filmu

1. Dynamiczne intro („TOP 5 — FILMY TYGODNIA")
2. Pozycje **#5 → #1**: plakat, tytuł, rok, gatunki, ocena TMDB, opis, popularność
3. Outro („DO ZOBACZENIA") z atrybucją TMDB

Całość **w języku polskim** — dane (opisy, gatunki) pobierane są z TMDB z `language=pl-PL`.

## Wymagania

- Node.js 20+ (testowane na 22)
- Klucz API z [themoviedb.org](https://www.themoviedb.org/settings/api) (darmowy)
- macOS/Windows: nic więcej. Linux CI: Remotion sam pobiera chrome-headless-shell i FFmpeg.

## Konfiguracja lokalna

```bash
npm install
cp .env.example .env      # wpisz swój klucz do TMDB_API_KEY
```

Zmienne środowiskowe (`.env`, nigdy nie commituj `.env`):

| Zmienna        | Opis                                   | Domyślnie   |
| -------------- | -------------------------------------- | ----------- |
| `TMDB_API_KEY` | Klucz API v3 z TMDB (**wymagany**)     | —           |
| `FORMAT`       | `landscape` albo `portrait`            | `landscape` |

## Użycie

```bash
npm run generate          # pobiera TOP 5 z TMDB → out/<YYYY-MM-DD>/data.json
npm run generate -- --mock  # dane testowe bez TMDB
npm run render            # renderuje MP4 → out/<YYYY-MM-DD>/top5-weekly-landscape.mp4
npm run render -- --format portrait       # wersja pionowa 1080x1920
npm run render -- --date 2026-08-24       # konkretny tydzień
npm run music             # regeneruje ścieżkę muzyczną public/theme-music.mp3
npm run studio            # podgląd w Remotion Studio
npm test                  # testy integralności projektu
```

Każdy tydzień ląduje w osobnym folderze `out/<data>/` (`data.json` + gotowe MP4).

## Automatyzacja (GitHub Actions)

Workflow `.github/workflows/weekly.yml`:

- uruchamia się **raz w tygodniu** (poniedziałek 06:00 UTC),
- obsługuje **workflow_dispatch** (ręczne uruchomienie z wyborem formatu landscape/portrait),
- pobiera klucz z sekretu `TMDB_API_KEY`,
- generuje dane, testuje projekt, renderuje wideo i wrzuca je jako artefakt.

Konfiguracja jednorazowa:

1. Repozytorium → *Settings → Secrets and variables → Actions*.
2. Dodaj **Repository secret**: `TMDB_API_KEY` = twój klucz TMDB.
3. Opcjonalnie: włącz *Actions → Weekly Top 5 Movies → Run workflow*, aby przetestować ręcznie.

Sekrety nigdy nie są zapisywane w kodzie — tylko przez environment variables / GitHub Secrets.

## Stały styl (theme)

Wszystkie kolory, fonty, animacje, przejścia, spacing, layout, czasy scen i muzyka są zdefiniowane w jednym miejscu: [`src/theme/theme.ts`](src/theme/theme.ts) (+ [`src/theme/fonts.ts`](src/theme/fonts.ts)). Motyw: **pomarańczowo-czarno-biały**. Komponenty nie mają własnych „magicznych" wartości — zmiana theme zmienia wygląd wszystkich odcinków.

Muzyka (procedurowo generowany utwór 128 BPM dopasowany do struktury scen) jest generowana przez `npm run music` do `public/theme-music.mp3` i dołączana do renderu z płynnym fade in/out.

Przełączanie formatu odbywa się przez `--format` / `FORMAT`; oba formaty korzystają z tej samej kompozycji i theme (layout adaptuje się automatycznie).

## Obsługa błędów

- brak klucza TMDB → czytelny błąd z instrukcją,
- TMDB niedostępny / błąd HTTP → komunikat i exit code 1,
- brak plakatu → stylizowany placeholder (render się nie wysypuje),
- brak szczegółów filmu → fallback na dane z listy trendów.

## Licencje / atrybucja

Dane i grafiki: [TMDB](https://www.themoviedb.org). Ten produkt korzysta z TMDB API, ale nie jest przez TMDB wspierany ani certyfikowany.
