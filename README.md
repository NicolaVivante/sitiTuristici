# sitiTuristici

# Consegna
memorizzare le recensioni dei siti (luoghi) turistici di Brescia

# Struttura delle entità del database

- Recensione
  - obbligatori:
    - idRecensione
    - punteggio (5 o 10 valori [1-5])
    - data (timestamp)
    - riferimento all'utente
    - riferimento al luogo
  - opzionali:
    - descrizione
    - foto
    - video
    - audio

- Utente
  - obbligatori:
    - idUtente
    - nome
    - password (hash o simili...)
  - opzionali:
    - descrizione
    - foto profilo
  
- Luogo
  - obbligatori:
    - idLuogo
    - nome
    - localizzazione GPS
  - opzionali:
    - orari
    - descrizione
    - foto
    - riferimenti esterni (sito web, socia, telefono...)



