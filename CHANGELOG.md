# Changelog

## 0.3.0

- Ridisegnata la card con righe compatte di circa 58 px, logo a sinistra e nessun riquadro interno.
- Programma corrente con barra di avanzamento aggiornata ogni 15 secondi; programma successivo con orario di inizio.
- Nomi dei canali nascosti per impostazione predefinita e attivabili dall’editor; nome sempre disponibile per accessibilità e come alternativa a loghi mancanti o non caricabili.
- Titolo della card facoltativo: viene mostrato solo se configurato.
- Layout compatto anche su mobile, titoli lunghi troncati, colori del tema HA e rispetto delle preferenze di movimento ridotto.
- Verificati avanzamento, orari mancanti/non validi, temi chiaro/scuro, larghezze da 280 px e mantenimento di azioni ed editor.


## 0.2.3

- Corretto il supporto delle azioni moderne `perform-action`: `perform_action`, `data` e `target` vengono inoltrati correttamente a Home Assistant senza modificare la configurazione salvata.
- Mantenuta la compatibilità con `call-service` e `service_data`, incluse le conferme delle azioni.
- I tocchi semplici sono immediati quando non è configurato un doppio tocco; i tocchi rapidi su canali diversi non si annullano più.
- Corretta la distinzione tra tocco, doppio tocco e pressione prolungata, con annullamento durante lo scorrimento e pulizia dei timer alla chiusura della card.
- Aggiunto supporto per attivazione da tastiera e notifica degli errori restituiti da Home Assistant.
- Aggiunti test browser per comandi, dati e destinazione, gesti mouse/touch/tastiera, conferme e gestione degli errori, senza comandare dispositivi reali.


## 0.2.2

- Ripristinati i selettori nativi di Home Assistant tramite ha-form: Home Assistant carica i componenti corretti del menu, senza elementi mwc-list-item incompatibili.
- Aggiunto nell’editor il nome personalizzato per ogni canale, usato nella card e nell’intestazione del pannello; il campo vuoto ripristina il nome del provider.
- Ogni canale è configurabile in un pannello nativo richiudibile. I canali esistenti partono chiusi, i nuovi si aprono automaticamente.
- Le azioni continuano a usare l’editor nativo di Home Assistant, caricato tramite il selettore ui_action.
- Verificati i controlli reali della demo ufficiale HA con 500 canali, selezione, nomi, azioni e apertura/chiusura dei pannelli.


## 0.2.1

- Corretto il menu di selezione dei canali nell'editor della card: le voci non si sovrappongono più.
- Sostituiti i selettori di canale e sorgente EPG con menu standard accessibili.
- Registrazione automatica della risorsa Lovelace e migrazione delle risorse già configurate.
- Versione della risorsa calcolata dal contenuto JavaScript per aggiornare automaticamente la cache dopo gli aggiornamenti e il riavvio di Home Assistant.
- Aggiunti test per registrazione, aggiornamento, deduplicazione e gestione delle risorse YAML.


## 0.2.0

- Aggiunto il selettore visuale della sorgente EPG nell'editor della card.
- Selezione automatica quando esiste una sola configurazione Advanced TV Remote.
- Nuova API WebSocket per elencare le sorgenti configurate.
- Gestione controllata delle configurazioni mancanti al posto di errori `KeyError`.

## 0.1.0

- Prima versione dell'integrazione, provider XMLTV e Lovelace card.
