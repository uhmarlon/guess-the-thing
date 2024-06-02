# Willkommen Entwickler 🚀

Diese Projekt ist ein Multiplayer-Spiele Plattform, die es ermöglicht, mit Freunden verschiedene Spiele zu spielen.
Alle Spiele werden eigenständig entwickelt und sind in dem Server integriert.

## Spiele

- Flaggen Raten
- Cocktails (Drinks) Raten

## Development

Das ganze Projekt ist in einer Monorepo-Struktur aufgebaut. Das bedeutet, dass alle Spiele
und der Server in einem Repository liegen.

Jeder Entwickler kann sich ein Spiel aussuchen und daran arbeiten. Die Spiele sind in eigenen
Verzeichnissen unter `socket/ multi or singel` abgelegt.

### Wichtig für Entwickler

- Jeder Entwickler sollte sich ein eigenes Branch erstellen und dort arbeiten.
- Vor dem Pushen sollte ein Pull-Request erstellt werden.
- Der Code sollte getestet sein und keine Fehler enthalten.
- Env Variablen sollten in einem `.env` File abgelegt werden. ( Diese werden immer mit Marlon abgesprochen)
- Alle env Variablen bekommt ihr von Marlon.

### Installation

1. Repository clonen
2. `nvm use` ausführen für die richtige Node Version
3. `pnpm install` ausführen immer ausführen wenn man neues Feature hinzufügt
4. `pnpm run dev` ausführen um den Client zu starten (Client starte automatisch nach änderungen neu)
5. `pnpm run server` ausführen um den Server zu starten (Server muss manuell neu gestartet werden)

### Deployment

Das Deployment wird auf Clientside automatisch durchgeführt. Der Server wird auf einen Root Server gehostet.
Bei änderungen am Server muss man immer Marlon informieren für das Deployment.

### Fragen

Bei Fragen könnt ihr euch immer an Marlon wenden. Er wird euch bei allen Problemen helfen.

### Viel Spaß beim Entwickeln 🚀

```
ps: Bitte immer auf die Codequalität achten und sauberen Code schreiben.
Wenn das Projekt geld einbringt, wird der Gewinn aufgeteilt anteilig an die Personen die am Projekt Prozentoal am Projekt gearbeitet haben. Beispiel: du machst 2 Games von insgesamt 10 Games, dann bekommst du 20% vom Gewinn.
```
