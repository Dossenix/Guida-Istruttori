# Guida Istruttori LSPD

Sito statico per GitHub Pages con guida istruttori, registro aggiornamenti e pannello di pubblicazione tramite GitHub Actions.

Repository: https://github.com/Dossenix/Guida-Istruttori

URL previsto del sito: https://dossenix.github.io/Guida-Istruttori/

## Pubblicazione su GitHub Pages

1. Vai in `Settings -> Pages`.
2. In `Build and deployment`, scegli `Deploy from a branch`.
3. Seleziona `main` e la cartella `/ (root)`.
4. Salva e attendi il completamento del deploy.
5. Apri `https://dossenix.github.io/Guida-Istruttori/`.

## Aggiornamenti automatici

Gli aggiornamenti pubblici vengono letti da `data/updates.json`.
Le integrazioni mostrate dentro la guida standard vengono lette da `data/guide-additions.json`.

Per pubblicare:

1. Apri `https://dossenix.github.io/Guida-Istruttori/admin.html`.
2. Compila titolo, data, autore, sezione del regolamento e contenuto.
3. Premi `Prepara invio`.
4. Premi `Apri GitHub`.
5. Su GitHub controlla il testo e premi `Submit new issue`.

La GitHub Action `Publish guide update` pubblica automaticamente la richiesta sia nel registro aggiornamenti sia nella sezione scelta della guida.
Solo le richieste create dall'account `Dossenix` vengono applicate.

La pagina `admin.html` non è linkata nella navigazione pubblica: resta accessibile solo digitando direttamente l'indirizzo.

## Firme attuali

- Capo della Polizia: White
- Direzione reparto Istruttori: Detroit
