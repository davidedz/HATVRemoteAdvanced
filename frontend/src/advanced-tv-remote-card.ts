import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { executeChannelAction, hasChannelAction } from "./actions";
import type { ChannelAction } from "./actions";
import type { CardConfig, Channel, ChannelConfig, EpgSource, HomeAssistant, Programme } from "./types";

const fire = (node:HTMLElement,type:string,detail:unknown) => node.dispatchEvent(new CustomEvent(type,{detail,bubbles:true,composed:true}));

@customElement("advanced-tv-remote-card")
export class AdvancedTvRemoteCard extends LitElement {
  @property({attribute:false}) hass?:HomeAssistant;
  @state() private config?:CardConfig;
  @state() private channels:Channel[]=[];
  @state() private programmes:Record<string,{current:Programme|null;next:Programme|null}>={};
  @state() private sourceRequired=false;
  @state() private now = Date.now();
  @state() private failedIcons = new Set<string>();
  private progressTimer?: number;
  private timer?: number;
  private holdTimer?: number;
  private press?: { index: number; pointerId: number; x: number; y: number };
  private suppressedClick?: number;
  private tapTimers = new Map<number, number>();
  setConfig(config:CardConfig){this.clearGestures();this.config={...config,channels:config.channels??[]};this.load();}
  connectedCallback(){super.connectedCallback();this.now=Date.now();this.timer=window.setInterval(()=>this.load(),60000);this.progressTimer=window.setInterval(()=>{this.now=Date.now()},15000);}
  disconnectedCallback(){window.clearInterval(this.timer);window.clearInterval(this.progressTimer);this.clearGestures();super.disconnectedCallback();}
  protected updated(changed:Map<PropertyKey,unknown>){if(changed.has("hass"))this.load()}
  private async load(){if(!this.hass||!this.config)return;let entryId=this.config.config_entry_id;if(!entryId){const sources=await this.hass.callWS<EpgSource[]>({type:"advanced_tv_remote/sources"});if(sources.length===1)entryId=sources[0].entry_id;else{this.sourceRequired=true;return}}this.sourceRequired=false;const [channels,programmes]=await Promise.all([this.hass.callWS<Channel[]>({type:"advanced_tv_remote/channels",config_entry_id:entryId}),this.hass.callWS<Record<string,{current:Programme|null;next:Programme|null}>>({type:"advanced_tv_remote/programs",config_entry_id:entryId,channel_ids:this.config.channels.map(c=>c.channel_id)})]);this.channels=channels;this.programmes=programmes;}
  private async action(index: number, kind: ChannelAction) {
    const config = this.config?.channels[index];
    if (!config || !this.hass) return;
    try {
      await executeChannelAction(this, this.hass, config, kind);
    } catch (error) {
      fire(this, "hass-notification", {
        message: `Impossibile eseguire il comando TV: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  private clearGestures() {
    window.clearTimeout(this.holdTimer);
    this.press = undefined;
    this.suppressedClick = undefined;
    this.tapTimers.forEach(timer => window.clearTimeout(timer));
    this.tapTimers.clear();
  }

  private down(index: number, event: PointerEvent) {
    if (event.button !== 0 || !event.isPrimary) return;
    window.clearTimeout(this.holdTimer);
    this.suppressedClick = undefined;
    this.press = { index, pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    if (!hasChannelAction(this.config?.channels[index], "hold")) return;
    this.holdTimer = window.setTimeout(() => {
      if (this.press?.index !== index || this.press.pointerId !== event.pointerId) return;
      this.suppressedClick = index;
      void this.action(index, "hold");
    }, 500);
  }

  private up(index: number, event: PointerEvent) {
    if (this.press?.index !== index || this.press.pointerId !== event.pointerId) return;
    window.clearTimeout(this.holdTimer);
    this.press = undefined;
  }

  private cancelPress(index: number, event: PointerEvent) {
    if (this.press?.index !== index || this.press.pointerId !== event.pointerId) return;
    window.clearTimeout(this.holdTimer);
    this.press = undefined;
    this.suppressedClick = index;
  }

  private move(index: number, event: PointerEvent) {
    if (this.press?.index === index && Math.hypot(event.clientX - this.press.x, event.clientY - this.press.y) > 12) {
      this.cancelPress(index, event);
    }
  }

  private handleClick(index: number, event: MouseEvent) {
    if (event.detail !== 0 && this.suppressedClick === index) {
      this.suppressedClick = undefined;
      return;
    }
    // Keyboard activation and channels without a double-tap action act at once.
    if (event.detail === 0 || !hasChannelAction(this.config?.channels[index], "double_tap")) {
      void this.action(index, "tap");
      return;
    }
    const pending = this.tapTimers.get(index);
    if (pending !== undefined) {
      window.clearTimeout(pending);
      this.tapTimers.delete(index);
      void this.action(index, "double_tap");
      return;
    }
    this.tapTimers.set(index, window.setTimeout(() => {
      this.tapTimers.delete(index);
      void this.action(index, "tap");
    }, 300));
  }
  private time(value: string | undefined): string {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isFinite(date.getTime())
      ? date.toLocaleTimeString(this.hass?.locale?.language, { hour: "2-digit", minute: "2-digit", hour12: false }) : "—";
  }

  private progress(programme: Programme | null | undefined): number | undefined {
    if (!programme) return undefined;
    const start = Date.parse(programme.start);
    const stop = Date.parse(programme.stop);
    if (!Number.isFinite(start) || !Number.isFinite(stop) || stop <= start) return undefined;
    return Math.max(0, Math.min(100, ((this.now - start) / (stop - start)) * 100));
  }

  render() {
    if (!this.config) return nothing;
    return html`<ha-card>
      ${this.config.title?.trim() ? html`<h2>${this.config.title}</h2>` : nothing}
      ${this.sourceRequired ? html`<p class="warning">Seleziona una sorgente EPG nell’editor della card.</p>` : nothing}
      <div class="channels">${this.config.channels.map((item, index) => {
        const channel = this.channels.find(c => c.id === item.channel_id);
        const name = item.name?.trim() || channel?.name || item.channel_id;
        const programmes = this.programmes[item.channel_id];
        const current = programmes?.current;
        const next = programmes?.next;
        const progress = this.progress(current);
        const icon = channel?.icon && !this.failedIcons.has(channel.icon) ? channel.icon : undefined;
        const nextTime = this.time(next?.start);
        const description = `${name}. ${current?.title ? `Ora: ${current.title}.` : "Programmazione non disponibile."}${progress !== undefined ? ` Avanzamento ${Math.round(progress)}%.` : ""}${next ? ` Alle ${nextTime}: ${next.title}.` : ""}`;
        return html`<button type="button" class="channel-row" aria-label=${description} title=${description}
          @pointerdown=${(event: PointerEvent) => this.down(index, event)}
          @pointerup=${(event: PointerEvent) => this.up(index, event)}
          @pointermove=${(event: PointerEvent) => this.move(index, event)}
          @pointercancel=${(event: PointerEvent) => this.cancelPress(index, event)}
          @pointerleave=${(event: PointerEvent) => this.cancelPress(index, event)}
          @click=${(event: MouseEvent) => this.handleClick(index, event)}
          @contextmenu=${(event: Event) => { if (hasChannelAction(item, "hold")) event.preventDefault(); }}>
          <span class="channel-logo">
            ${icon ? html`<img src=${icon} alt=${name} loading="lazy" decoding="async"
              @error=${() => { this.failedIcons = new Set([...this.failedIcons, icon]); }}>`
              : html`<span class="logo-fallback">${name}</span>`}
          </span>
          <span class="programme">
            ${this.config?.show_channel_names ? html`<span class="channel-name">${name}</span>` : nothing}
            <span class="current-title">${current?.title || "Programmazione non disponibile"}</span>
            <span class="progress-track" aria-hidden="true">
              ${progress !== undefined ? html`<span class="progress-fill" style=${`width:${progress}%`}></span>` : nothing}
            </span>
            <span class="next-programme">
              ${next ? html`<time datetime=${next.start}>${nextTime}</time><span class="next-title">${next.title}</span>`
                : html`<span class="next-title unavailable">Prossimo programma non disponibile</span>`}
            </span>
            ${progress !== undefined ? html`<span class="sr-only">Programma completato al ${Math.round(progress)}%.</span>` : nothing}
          </span>
        </button>`;
      })}</div>
    </ha-card>`;
  }

  static styles = css`
    :host { display: block; --tv-accent: var(--primary-color, #03a9f4); }
    ha-card { overflow: hidden; padding: 4px 0; }
    h2 { margin: 0; padding: 12px 14px 8px; font-size: 15px; font-weight: 600; line-height: 1.3; letter-spacing: -.2px; }
    .warning { margin: 10px 14px; color: var(--error-color); font-size: 13px; }
    .channels { display: grid; }
    .channel-row {
      box-sizing: border-box; width: 100%; min-width: 0; min-height: 58px;
      display: grid; grid-template-columns: 36px minmax(0, 1fr); align-items: center; gap: 12px;
      margin: 0; padding: 8px 14px; border: 0; border-radius: 0;
      background: transparent; color: var(--primary-text-color); font: inherit; text-align: start;
      cursor: pointer; touch-action: manipulation; user-select: none; -webkit-tap-highlight-color: transparent;
      transition: background-color 120ms ease;
    }
    .channel-row + .channel-row { border-top: 1px solid color-mix(in srgb, var(--divider-color, #888) 45%, transparent); }
    @media (hover: hover) { .channel-row:hover { background: color-mix(in srgb, var(--tv-accent) 5%, transparent); } }
    .channel-row:active { background: color-mix(in srgb, var(--tv-accent) 10%, transparent); }
    .channel-row:focus-visible { outline: 2px solid var(--tv-accent); outline-offset: -2px; border-radius: 4px; }
    .channel-logo { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; }
    img { display: block; width: 100%; height: 100%; object-fit: contain; }
    .logo-fallback { max-width: 100%; font-size: 10px; font-weight: 600; line-height: 1.15; text-align: center; overflow-wrap: anywhere; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
    .programme { display: block; min-width: 0; }
    .current-title, .channel-name, .next-title { display: block; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .current-title { font-size: 13px; line-height: 17px; font-weight: 550; letter-spacing: -.1px; }
    .channel-name { margin-bottom: 2px; color: var(--secondary-text-color); font-size: 10px; line-height: 12px; }
    .progress-track { display: block; height: 2px; margin: 4px 0 4px; overflow: hidden; border-radius: 4px; background: color-mix(in srgb, var(--primary-text-color) 9%, transparent); }
    .progress-fill { display: block; height: 100%; border-radius: inherit; background: var(--tv-accent); transition: width 1s linear; }
    .next-programme { display: flex; align-items: baseline; gap: 7px; min-width: 0; color: var(--secondary-text-color); font-size: 11px; line-height: 14px; }
    time { flex: 0 0 auto; color: var(--tv-accent); font-size: 10px; font-weight: 600; font-variant-numeric: tabular-nums; }
    .next-title { flex: 1; }
    .unavailable { opacity: .7; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
    @media (prefers-reduced-motion: reduce) { .channel-row, .progress-fill { transition: none; } }
  `;
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
    show_channel_names: "Mostra nomi dei canali", name: "Nome personalizzato", tap_action: "Tocco",
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
          { name: "show_channel_names", selector: { boolean: {} } },
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
