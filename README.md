# Beispielprojekt Deno Fresh mit Datenbankverbindung

## Beschreibung

Dieses Projekt ist ein Beispielprojekt für die Verwendung von Deno mit einer Datenbankverbindung.
Es kann dazu verwendet werden, jegliche Art von Fullstack-Anwendung (Frontend + Backend + Middleware) zu verwirklichen.

## Vorbereitung

1. Deno installieren: <https://deno.land/manual/getting_started/installation>

2. Deno deployctl installieren

    ```bash
    deno install --allow-all --no-check -r -f https://deno.land/x/deploy/deployctl.ts
    ```

3. Deno deployctl Account erstellen

    Geh auf [https://dash.deno.com](deployctl) und erstelle einen Account.
    Nachdem ein Account erstellt wurde, kann der obige Link genutzt werdne, um einen Access-Token zu erstellen.
    Dieser Access-Token muss in der deno.json eingetragen werden unter tasks -> preview und tasks -> prod.

4. Projekt klonen

    ```bash
    git clone https://github.com/robvanvolt/zeiterfassung.git
    ```

5. Ins projektverzeichnis wechseln

    ```bash
    cd zeiterfassung
    ```

6. Visual studio code starten

    ```bash
    code .
    ```

7. Access-Token für das Deployment eintragen

    Den access-token hier herholen [https://dash.deno.com/account#access-tokens](deployctl) und in
    der deno.json Datei im Root-Directory unter tasks -> preview und tasks -> prod eintragen

8. Datenbankverbindung eintragen

    In der .env Datei im Root-Directory die Datenbankverbindung eintragen:

    | Schlüssel  | Beschreibung                       |
    |------------|------------------------------------|
    | HOST       | Hostname der Datenbank             |
    | USERNAME   | Benutzername der Datenbank         |
    | PASSWORD   | Passwort des Benutzers             |
    | DATABASE   | Name der Datenbank                 |
    | PORT       | Port der Datenbank                 |

    **Anmerkung**: Die .env Datei mit den realen Datenbankvariablen wird nicht mit in das Repository übernommen,
    da sie sensible Daten enthält. Die Variablen aus der .env Datei werden nämlich in der routes/api/db.ts Datei ausgelesen,
    um eine Verbindung zu einer Datenbank (in diesem Beispiel MariaDB) aufzubauen.

## Nutzung

Sobald alles eingerichtet ist kann das Projekt mit folgenden Befehlen im Terminal gestartet / hochgeladen werden:

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
