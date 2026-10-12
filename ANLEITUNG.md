# Website Bodensee-Symposium 2027 – Anleitung

Die Website ist eine einzige, schlanke Seite auf Englisch. Alle Texte, Preise, Hotels, Partner und Downloads stehen in einfachen Inhaltsdateien im Ordner `content/`. Bearbeitet werden sie im Browser mit **Pages CMS**, ohne Programmierkenntnisse.

## Was liegt wo

| Ordner / Datei | Inhalt | Wer bearbeitet |
|---|---|---|
| `content/` | alle Texte der Website (7 Bereiche) | Team, über Pages CMS |
| `uploads/` | hochgeladene PDFs, Bilder und Logos | Team, über Pages CMS |
| `index.html`, `assets/` | Design und Technik | nur bei Designänderungen |
| `.pages.yml` | Aufbau des Editors (Felder, Bezeichnungen) | nur bei neuen Feldern |
| `CMS-KONFIGURATION.yml` | sichtbare Kopie von `.pages.yml` (siehe Schritt 3) | – |

---

## A. Einmalige Einrichtung (ca. 45 Minuten, eine Person)

### 1. GitHub-Konto anlegen
Auf [github.com](https://github.com) ein Gratis-Konto erstellen, am besten mit einer Funktionsadresse (z. B. info@museums.ch). Optional eine Organisation «icom-schweiz» anlegen, dann gehört die Website nicht einer Einzelperson.

### 2. Repository erstellen
«New repository» → Name z. B. `bodensee-symposium-2027` → **Public** → ohne README → «Create repository».

### 3. Dateien hochladen
Auf der leeren Repository-Seite «uploading an existing file» wählen. Den **Inhalt** des entpackten Ordners (nicht den Ordner selbst) ins Browserfenster ziehen → «Commit changes».

Prüfen, ob die Dateien `.pages.yml` und `.nojekyll` mit hochgeladen wurden. Der Mac blendet Dateien mit Punkt am Anfang aus; im Finder macht sie **Cmd + Shift + .** sichtbar. Fehlt `.pages.yml`: in GitHub «Add file → Create new file», Namen `.pages.yml` eingeben und den Inhalt von `CMS-KONFIGURATION.yml` hineinkopieren.

### 4. Website online schalten (GitHub Pages)
Im Repository: **Settings → Pages** → Source «Deploy from a branch» → Branch `main`, Ordner `/ (root)` → «Save».
Nach 1–2 Minuten ist die Seite online unter `https://KONTONAME.github.io/bodensee-symposium-2027/`.

### 5. Editor verbinden (Pages CMS)
[app.pagescms.org](https://app.pagescms.org) öffnen → «Sign in with GitHub» → die Pages-CMS-App installieren und **nur dieses Repository** freigeben → Repository öffnen. Links erscheinen die sieben Bereiche:

1. Startseite und Allgemeines
2. Programm, Call, Livestream, Downloads
3. Anmeldung und Preise
4. Ort, Anreise und Hotels
5. Partner und Sponsoren
6. Veranstalter und Kontakt
7. Datenschutz und Impressum

### 6. Mitarbeitende einladen
Im Repository in Pages CMS auf **Collaborators** → E-Mail-Adresse eintragen. Die Person bekommt einen Login-Link per E-Mail und braucht **kein GitHub-Konto**. Mitarbeitende können Inhalte und Dateien bearbeiten, aber nichts an der Technik verändern.

### 7. Kontaktformular aktivieren (Formspree)
[formspree.io](https://formspree.io) → Konto mit info@museums.ch anlegen → «New form» → den Endpoint kopieren (sieht so aus: `https://formspree.io/f/abcdwxyz`).
In Pages CMS unter **6 · Veranstalter und Kontakt → Formular-Adresse (Formspree)** einfügen → «Save».
Danach eine Testnachricht über die Website senden. Beim ersten Mal verlangt Formspree eine Bestätigung per E-Mail.
Solange das Feld leer ist, zeigt das Formular einen Hinweis und die E-Mail-Adresse an.

### 8. Eigene Domain (optional, empfohlen)
Zum Beispiel `bodenseesymposium2027.org` oder eine Subdomain wie `2027.bodenseesymposium.info`.
GitHub: **Settings → Pages → Custom domain** eintragen. Beim Domain-Anbieter einen **CNAME**-Eintrag auf `KONTONAME.github.io` setzen (bei einer Hauptdomain ohne «www» zusätzlich die A-Einträge von GitHub, siehe [GitHub-Hilfe](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)). Danach «Enforce HTTPS» aktivieren.

---

## B. Im Alltag: Inhalte ändern

[app.pagescms.org](https://app.pagescms.org) → anmelden → Bereich wählen → ändern → **Save**. Nach etwa einer Minute ist die Änderung online (Seite neu laden).

| Wenn … | dann in Pages CMS … |
|---|---|
| die Seite offiziell ist | **1 · Startseite** → «Hinweisbalken anzeigen» ausschalten |
| das Programm abgesegnet ist | **2 · Programm** → «Thema – Text» ersetzen (steht jetzt auf «Coming soon») und unter «Programmpunkte» Einträge hinzufügen (Zeit, Format, Titel, Referierende). Der Block «Schedule» erscheint automatisch mit dem ersten Programmpunkt. |
| der Call for Contributions startet | **2 · Programm** → Call: Text und Eingabeschluss ergänzen, Link oder PDF eintragen, Status auf «Offen». Erst dann erscheint der Button. |
| der Livestream steht | **2 · Programm** → Livestream: Link eintragen, Status «Live». Nach dem Anlass Link zur Aufzeichnung eintragen, Status «Beendet». |
| Unterlagen bereit sind | **2 · Programm** → «Downloads» → Eintrag hinzufügen → PDF hochladen (oder Link) |
| die Anmeldung öffnet | **3 · Anmeldung** → Status «Offen», Preise eintragen. Hat EMYA einen direkten Link aufs Anmeldeformular, diesen bei «Link zur Anmeldung» einsetzen. |
| die Räume im Museumsquartier feststehen | **4 · Ort** → «Zusatzinfo» ergänzen (Gebäude, Saal, Eingang) |
| Hotels/Kontingente bekannt sind | **4 · Ort** → «Hotels» → Eintrag hinzufügen (Name, Lage, Sonderpreis/Code, Website) |
| ein Partner zusagt | **5 · Partner** → Eintrag hinzufügen, Kategorie wählen, Logo hochladen (PNG/SVG mit transparentem Hintergrund) |

Längere Texte (z. B. «About», Thema, Datenschutz) haben eine kleine Werkzeugleiste für Fett, Links und Listen.

---

## C. Vor dem Go-live prüfen

- **Datenschutzerklärung und Impressum** sind Entwürfe. Bitte prüfen lassen, insbesondere die Weitergabe von Anmeldedaten durch EMYA2027 und die Dienste GitHub (Hosting) und Formspree (Formular). Wer die Website anders hostet (z. B. bei Infomaniak), passt den Abschnitt «Visiting this website» an.
- Alle **Platzhalter** ersetzen: Programm («Coming soon»), Preise («To be announced»), Räume im Museumsquartier, Hotels.
- Die englischen Texte gegenlesen.

## D. Kosten

GitHub, GitHub Pages und Pages CMS sind gratis. Formspree hat einen Gratis-Plan mit einer begrenzten Zahl Nachrichten pro Monat, was für ein Kontaktformular normalerweise reicht. Eine eigene Domain kostet die übliche Jahresgebühr beim Anbieter.

## E. Design oder Technik ändern

Design und Verhalten stecken in `assets/style.css` und `assets/app.js`. Jede Webentwicklerin und jeder Webentwickler kann das anpassen. Hinweis: `index.html` direkt vom Computer geöffnet bleibt leer, weil die Inhalte nachgeladen werden. Zum Anschauen immer die Online-Adresse verwenden.
