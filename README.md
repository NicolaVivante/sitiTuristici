# sitiTuristici

# Consegna
memorizzare le recensioni dei siti (luoghi) turistici di Brescia

# Struttura delle entità del database

- Recensione
  - obbligatori:
    - idRecensione
    - punteggio (5 o 10 valori [1-5])
    - data
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
    - data registrazione
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

# Formato dei dati

- id: fornito da firebase
- nome, descrizione: stringa
- data: timestamp
- media: BLOB, gestito da firebase
- password: hash della password
- riferimenti esterni: link

