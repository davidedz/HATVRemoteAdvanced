# Advanced TV Remote

Integrazione custom Home Assistant e Lovelace card installabile tramite HACS. Mostra logo, programma corrente con barra di avanzamento e programma successivo con orario di inizio in righe compatte di circa 58 px; ogni riga supporta le azioni standard Home Assistant su tap, pressione prolungata e doppio tap.

## Installazione

1. Aggiungere il repository come repository personalizzato HACS di tipo **Integration**, oppure copiare `custom_components/advanced_tv_remote` in `config/custom_components/`.
2. La risorsa JavaScript della card viene registrata automaticamente dall’integrazione. Le risorse già presenti con il percorso `/advanced_tv_remote/advanced-tv-remote-card.js` vengono aggiornate senza crearne duplicati.
3. Riavviare Home Assistant e aggiungere **Advanced TV Remote** da Impostazioni → Dispositivi e servizi.
4. Inserire un URL XMLTV pubblico o privato, `.xml` o `.gz`.
5. Aggiungere la card dall'editor visuale Lovelace.

## Aspetto della card

Il layout è compatto anche su mobile. Il logo identifica il canale; il nome rimane disponibile passando il puntatore e per i lettori di schermo. Se il logo manca o non si carica, viene mostrato il nome come alternativa. Per visualizzare sempre i nomi, attivare **Mostra nomi dei canali** nell’editor oppure impostare `show_channel_names: true` nel YAML.

La barra indica la porzione trascorsa del programma corrente e si aggiorna ogni 15 secondi. La riga sotto mostra l’orario di inizio e il titolo del programma successivo. I dati EPG continuano a essere richiesti ogni minuto. Il titolo della card è facoltativo: senza `title` lo spazio è dedicato ai canali.

## Esempio YAML

```yaml
type: custom:advanced-tv-remote-card
title: Guida TV
# Facoltativo quando è configurata una sola sorgente EPG.
config_entry_id: 01ABCDEF...
channels:
  - channel_id: rai1.it
    name: Rai 1
    tap_action:
      action: perform-action
      perform_action: media_player.play_media
      target:
        entity_id: media_player.tv
      data:
        media_content_type: channel
        media_content_id: "1"
    hold_action:
      action: more-info
      entity: media_player.tv
    double_tap_action:
      action: toggle
      entity: switch.tv
```

L'editor permette di scegliere la sorgente EPG configurata senza cercare manualmente il `config_entry_id`. Quando esiste una sola sorgente viene selezionata automaticamente. Usa `ha-form` e i selettori nativi di Home Assistant per canali e azioni, caricando i componenti corretti per la versione installata. Ogni canale è racchiuso in un pannello richiudibile: cliccare sull’intestazione per aprirlo o chiuderlo. Il campo **Nome personalizzato** modifica il nome mostrato nella card e nell’intestazione; lasciandolo vuoto si usa il nome fornito dalla guida TV. I canali esistenti sono inizialmente chiusi, mentre un nuovo canale si apre subito per la configurazione.

Sono supportate le azioni moderne `perform-action` con `perform_action`, `data` e `target`, oltre alle azioni precedenti `call-service`. Un tocco viene eseguito subito, salvo quando è configurata un’azione di doppio tocco: in quel caso la card attende brevemente per distinguere i due gesti. Se Home Assistant restituisce un errore nell’esecuzione del comando, viene mostrata una notifica.

## Sviluppo

Da `frontend`: `npm install`, `npm run typecheck`, `npm run build`. Il backend richiede Python 3.12 e le dipendenze dell'ambiente di sviluppo Home Assistant.

Il test del layout `node tests/test_card_layout.cjs` verifica compattezza, avanzamento, orari, loghi e larghezze ridotte. Richiede Playwright e Chromium; la variabile `EDITOR_SCREENSHOTS` permette di salvare anteprime con dati dimostrativi.

Il test delle azioni `node tests/test_card_actions.cjs` usa chiamate HA simulate e non comanda dispositivi reali. Richiede Playwright e un browser Chromium installati.

Il test UI `node tests/test_card_editor.cjs` richiede Playwright e un browser Chromium installati. Usa i componenti reali della demo ufficiale di Home Assistant, quindi richiede accesso a Internet; non usa credenziali o un’installazione HA personale. Per usare Microsoft Edge impostare `PLAYWRIGHT_CHANNEL=msedge`.

## Dati, licenze e limiti

L'integrazione contatta solo l'URL XMLTV configurato. Non include né redistribuisce un feed proprietario: disponibilità, correttezza e licenza dei palinsesti dipendono dal provider scelto.

## Aggiornamento della card

Dopo un aggiornamento dell’integrazione, riavviare Home Assistant e ricaricare la pagina della dashboard. Il parametro di versione della risorsa viene calcolato automaticamente dal contenuto del file JavaScript: non occorre modificarlo a mano. Una dashboard già aperta richiede comunque una ricarica della pagina.

Se le risorse Lovelace sono gestite in YAML, la registrazione automatica non è disponibile: configurare una volta `/advanced_tv_remote/advanced-tv-remote-card.js` come modulo senza parametro `?v`. Il file viene servito senza cache a lungo termine; ricaricare il browser dopo gli aggiornamenti.
