# Advanced TV Remote

Integrazione custom Home Assistant e Lovelace card installabile tramite HACS. Mostra programma corrente e successivo dei canali TV selezionati; ogni riga supporta le azioni standard Home Assistant su tap, pressione prolungata e doppio tap.

## Installazione

1. Aggiungere il repository come repository personalizzato HACS di tipo **Integration**, oppure copiare `custom_components/advanced_tv_remote` in `config/custom_components/`.
2. La risorsa JavaScript della card viene registrata automaticamente dall’integrazione. Le risorse già presenti con il percorso `/advanced_tv_remote/advanced-tv-remote-card.js` vengono aggiornate senza crearne duplicati.
3. Riavviare Home Assistant e aggiungere **Advanced TV Remote** da Impostazioni → Dispositivi e servizi.
4. Inserire un URL XMLTV pubblico o privato, `.xml` o `.gz`.
5. Aggiungere la card dall'editor visuale Lovelace.

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

L'editor permette di scegliere la sorgente EPG configurata senza cercare manualmente il `config_entry_id`. Quando esiste una sola sorgente viene selezionata automaticamente. Usa inoltre `hui-action-editor`, il componente nativo di Home Assistant, e quindi espone le azioni supportate dalla versione installata.

## Sviluppo

Da `frontend`: `npm install`, `npm run typecheck`, `npm run build`. Il backend richiede Python 3.12 e le dipendenze dell'ambiente di sviluppo Home Assistant.

## Dati, licenze e limiti

L'integrazione contatta solo l'URL XMLTV configurato. Non include né redistribuisce un feed proprietario: disponibilità, correttezza e licenza dei palinsesti dipendono dal provider scelto.

## Aggiornamento della card

Dopo un aggiornamento dell’integrazione, riavviare Home Assistant e ricaricare la pagina della dashboard. Il parametro di versione della risorsa viene calcolato automaticamente dal contenuto del file JavaScript: non occorre modificarlo a mano. Una dashboard già aperta richiede comunque una ricarica della pagina.

Se le risorse Lovelace sono gestite in YAML, la registrazione automatica non è disponibile: configurare una volta `/advanced_tv_remote/advanced-tv-remote-card.js` come modulo senza parametro `?v`. Il file viene servito senza cache a lungo termine; ricaricare il browser dopo gli aggiornamenti.
