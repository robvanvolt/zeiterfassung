# Beispielprojekt Deno Fresh mit Datenbankverbindung

## Beschreibung

Dieses Projekt ist ein Beispielprojekt für die Verwendung von Deno mit einer Datenbankverbindung.

## Setup

1. Deno installieren: <https://deno.land/manual/getting_started/installation>

2. Deno deployctl installieren

    ```bash
    deno install --allow-all --no-check -r -f https://deno.land/x/deploy/deployctl.ts
    ```

3. Projekt klonen

    ```bash
    git clone github...
    ```

4. Ins projektverzeichnis wechseln

    ```bash
    cd Zeiterfassung
    ```

## Nutzung

### Für die lokale Entwicklung

```bash
deno task start
```

### Für die Veröffentlichung auf einem Experimentier-Server

```bash
deno task preview
```

### Für die Veröffentlichung auf dem Produktiv-Server

```bash
deno task prod
```
