import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { handleAction } from "custom-card-helpers";
import type { CardConfig, Channel, ChannelConfig, EpgSource, HomeAssistant, Programme } from "./types";

const fire = (node:HTMLElement,type:string,detail:unknown) => node.dispatchEvent(new CustomEvent(type,{detail,bubbles:true,composed:true}));

@customElement("advanced-tv-remote-card")
export class AdvancedTvRemoteCard extends LitElement {
  @property({attribute:false}) hass?:HomeAssistant;
  @state() private config?:CardConfig;
  @state() private channels:Channel[]=[];
  @state() private programmes:Record<string,{current:Programme|null;next:Programme|null}>={};
  @state() private sourceRequired=false;
  private timer?:number; private holdTimer?:number; private held=false; private lastTap=0;
  setConfig(config:CardConfig){this.config={...config,channels:config.channels??[]};this.load();}
  connectedCallback(){super.connectedCallback();this.timer=window.setInterval(()=>this.load(),60000);}
  disconnectedCallback(){window.clearInterval(this.timer);super.disconnectedCallback();}
  protected updated(changed:Map<PropertyKey,unknown>){if(changed.has("hass"))this.load()}
  private async load(){if(!this.hass||!this.config)return;let entryId=this.config.config_entry_id;if(!entryId){const sources=await this.hass.callWS<EpgSource[]>({type:"advanced_tv_remote/sources"});if(sources.length===1)entryId=sources[0].entry_id;else{this.sourceRequired=true;return}}this.sourceRequired=false;const [channels,programmes]=await Promise.all([this.hass.callWS<Channel[]>({type:"advanced_tv_remote/channels",config_entry_id:entryId}),this.hass.callWS<Record<string,{current:Programme|null;next:Programme|null}>>({type:"advanced_tv_remote/programs",config_entry_id:entryId,channel_ids:this.config.channels.map(c=>c.channel_id)})]);this.channels=channels;this.programmes=programmes;}
  private action(index:number,kind:"tap"|"hold"|"double_tap"){const cfg=this.config?.channels[index];if(cfg&&this.hass)handleAction(this,this.hass as any,cfg as any,kind as any)}
  private down(index:number){this.held=false;this.holdTimer=window.setTimeout(()=>{this.held=true;this.action(index,"hold")},500)}
  private up(index:number){window.clearTimeout(this.holdTimer);if(this.held)return;const now=Date.now();if(now-this.lastTap<300){this.lastTap=0;this.action(index,"double_tap")}else{this.lastTap=now;window.setTimeout(()=>{if(this.lastTap===now)this.action(index,"tap")},310)}}
  render(){if(!this.config)return nothing;return html`<ha-card><h2>${this.config.title??"Guida TV"}</h2>${this.sourceRequired?html`<p class="warning">Seleziona una sorgente EPG nell'editor della card.</p>`:nothing}<div class="grid">${this.config.channels.map((item,i)=>{const channel=this.channels.find(c=>c.id===item.channel_id);const p=this.programmes[item.channel_id];return html`<button @pointerdown=${()=>this.down(i)} @pointerup=${()=>this.up(i)} @pointercancel=${()=>window.clearTimeout(this.holdTimer)}><div class="channel">${channel?.icon?html`<img src=${channel.icon}>`:nothing}<strong>${item.name?.trim()||channel?.name||item.channel_id}</strong></div><div class="show"><b>Ora</b><span>${p?.current?.title??"Programmazione non disponibile"}</span>${p?.current?html`<small>${new Date(p.current.start).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}–${new Date(p.current.stop).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</small>`:nothing}</div><div class="next"><b>Dopo</b><span>${p?.next?.title??"—"}</span></div></button>`})}</div></ha-card>`}
  static styles=css`:host{display:block}ha-card{padding:16px}h2{margin:0 0 12px}.warning{color:var(--error-color);margin:8px 0}.grid{display:grid;gap:10px}button{font:inherit;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;padding:12px;text-align:left;display:grid;grid-template-columns:minmax(110px,.7fr) 1.4fr 1fr;gap:16px;cursor:pointer}.channel,.show,.next{display:flex;align-items:center;gap:8px;min-width:0}.show,.next{align-items:flex-start;flex-direction:column}.show span,.next span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}img{width:42px;height:42px;object-fit:contain}small{color:var(--secondary-text-color)}@media(max-width:600px){button{grid-template-columns:1fr}.next{border-top:1px solid var(--divider-color);padding-top:8px}}`;
  static getConfigElement(){return document.createElement("advanced-tv-remote-card-editor")}
  static getStubConfig(){return {type:"custom:advanced-tv-remote-card",channels:[]}}
}

@customElement("advanced-tv-remote-card-editor")
export class AdvancedTvRemoteCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: CardConfig;
  @state() private channels: Channel[] = [];
  @state() private sources: EpgSource[] = [];
  @state() private expanded = new Set<number>();
  @state() private componentError = false;
  private loadSequence = 0;

  connectedCallback() {
    super.connectedCallback();
    void this.loadComponents();
  }

  private async loadComponents() {
    if (customElements.get("ha-form")) return;
    try {
      // Loading a built-in card editor also loads HA's form/selector registry.
      // HA then imports its own select, list items and action editor as needed.
      const helpers = await window.loadCardHelpers!();
      const card = await helpers.createCardElement({ type: "entities", entities: [] });
      await (card.constructor as typeof HTMLElement & {
        getConfigElement: () => Promise<HTMLElement>;
      }).getConfigElement();
      await customElements.whenDefined("ha-form");
      this.componentError = false;
    } catch {
      this.componentError = true;
    }
  }

  setConfig(config: CardConfig) {
    this.config = { ...config, channels: config.channels ?? [] };
    void this.load();
  }

  protected updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has("hass")) void this.load();
  }

  private async load() {
    if (!this.hass || !this.config) return;
    const sequence = ++this.loadSequence;
    const sources = await this.hass.callWS<EpgSource[]>({ type: "advanced_tv_remote/sources" });
    if (sequence !== this.loadSequence) return;
    this.sources = sources;
    let entryId = this.config.config_entry_id;
    if (!entryId && sources.length === 1) {
      entryId = sources[0].entry_id;
      this.changed({ ...this.config, config_entry_id: entryId });
    }
    if (!entryId) { this.channels = []; return; }
    const channels = await this.hass.callWS<Channel[]>({
      type: "advanced_tv_remote/channels", config_entry_id: entryId,
    });
    if (sequence === this.loadSequence) this.channels = channels;
  }

  private changed(config: CardConfig) {
    this.config = config;
    fire(this, "config-changed", { config });
  }

  private generalChanged(event: CustomEvent<{ value: Partial<CardConfig> }>) {
    event.stopPropagation();
    if (!this.config) return;
    const value = event.detail.value;
    const entryId = value.config_entry_id;
    const sourceChanged = typeof entryId === "string" && entryId !== this.config.config_entry_id;
    if (sourceChanged) { this.channels = []; this.expanded = new Set(); }
    this.changed({
      ...this.config, ...value,
      channels: sourceChanged ? [] : this.config.channels,
    });
    if (sourceChanged) void this.load();
  }

  private channelChanged(index: number, event: CustomEvent<{ value: ChannelConfig }>) {
    event.stopPropagation();
    if (!this.config) return;
    const updated = { ...this.config.channels[index], ...event.detail.value };
    // Empty names fall back to the provider name and are omitted from YAML.
    if (!updated.name?.trim()) delete updated.name;
    this.changed({ ...this.config, channels: this.config.channels.map((c, i) => i === index ? updated : c) });
  }

  private toggle(index: number, event: CustomEvent<{ expanded: boolean }>) {
    event.stopPropagation();
    const expanded = new Set(this.expanded);
    if (event.detail.expanded) expanded.add(index); else expanded.delete(index);
    this.expanded = expanded;
  }

  private add() {
    if (!this.config || !this.channels.length) return;
    this.expanded = new Set([...this.expanded, this.config.channels.length]);
    this.changed({ ...this.config, channels: [...this.config.channels, {
      channel_id: this.channels[0].id, tap_action: { action: "none" },
    }] });
  }

  private removeChannel(index: number) {
    if (!this.config) return;
    this.expanded = new Set([...this.expanded].filter(i => i !== index).map(i => i > index ? i - 1 : i));
    this.changed({ ...this.config, channels: this.config.channels.filter((_, i) => i !== index) });
  }

  private label = (schema: { name: string }) => ({
    title: "Titolo", config_entry_id: "Sorgente EPG", channel_id: "Canale",
    name: "Nome personalizzato", tap_action: "Tocco",
    hold_action: "Pressione prolungata", double_tap_action: "Doppio tocco",
  }[schema.name] ?? schema.name);

  private helper = (schema: { name: string }) => schema.name === "name"
    ? "Facoltativo. Lascia vuoto per usare il nome della guida TV." : undefined;

  private channelSchema(channel: ChannelConfig, index: number) {
    const options = this.channels.map(ch => ({ value: ch.id, label: ch.name }));
    if (channel.channel_id && !options.some(ch => ch.value === channel.channel_id)) {
      options.unshift({ value: channel.channel_id, label: channel.channel_id });
    }
    return [{
      name: "", type: "expandable", flatten: true,
      title: channel.name?.trim() || this.channels.find(ch => ch.id === channel.channel_id)?.name || channel.channel_id || `Canale ${index + 1}`,
      expanded: this.expanded.has(index),
      schema: [
        { name: "channel_id", required: true, selector: { select: { mode: "dropdown", options } } },
        { name: "name", selector: { text: {} } },
        ...(["tap_action", "hold_action", "double_tap_action"] as const).map(name => ({
          name, selector: { ui_action: { default_action: "none" } },
        })),
      ],
    }];
  }

  render() {
    if (!this.config) return nothing;
    return html`<div class="editor">
      ${this.componentError ? html`<p>Impossibile caricare i controlli di Home Assistant.</p>
        <ha-button @click=${() => this.loadComponents()}>Riprova</ha-button>` : nothing}
      <ha-form .hass=${this.hass} .data=${this.config}
        .schema=${[
          { name: "title", selector: { text: {} } },
          { name: "config_entry_id", required: true, selector: { select: {
            mode: "dropdown", options: this.sources.map(source => ({ value: source.entry_id, label: source.title })),
          } } },
        ]}
        .computeLabel=${this.label}
        @value-changed=${this.generalChanged}></ha-form>
      ${this.config.channels.map((channel, index) => html`<section>
        <ha-form .hass=${this.hass} .data=${channel}
          .schema=${this.channelSchema(channel, index)}
          .computeLabel=${this.label} .computeHelper=${this.helper}
          @expanded-changed=${(event: CustomEvent<{ expanded: boolean }>) => this.toggle(index, event)}
          @value-changed=${(event: CustomEvent<{ value: ChannelConfig }>) => this.channelChanged(index, event)}></ha-form>
        ${this.expanded.has(index) ? html`<ha-button class="remove"
          @click=${() => this.removeChannel(index)}>Rimuovi canale</ha-button>` : nothing}
      </section>`)}
      <ha-button .disabled=${!this.config.config_entry_id || !this.channels.length}
        @click=${this.add}>Nuovo canale</ha-button>
    </div>`;
  }

  static styles = css`
    .editor { display: grid; gap: 16px; }
    section, ha-form { min-width: 0; }
    .remove { display: block; margin-top: 8px; --primary-color: var(--error-color); }
  `;
}

declare global{interface Window{customCards?:unknown[];loadCardHelpers?:()=>Promise<{createCardElement:(config:unknown)=>Promise<HTMLElement>}>}}window.customCards=window.customCards??[];window.customCards.push({type:"advanced-tv-remote-card",name:"Advanced TV Remote",description:"Guida TV italiana con azioni per canale",preview:true});
