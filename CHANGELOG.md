# Changelog

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
