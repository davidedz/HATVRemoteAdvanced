import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { handleAction } from "custom-card-helpers";
import type { CardConfig, Channel, HomeAssistant, Programme } from "./types";

const fire = (node:HTMLElement,type:string,detail:unknown) => node.dispatchEvent(new CustomEvent(type,{detail,bubbles:true,composed:true}));

@customElement("advanced-tv-remote-card")
export class AdvancedTvRemoteCard extends LitElement {
  @property({attribute:false}) hass?:HomeAssistant;
  @state() private config?:CardConfig;
  @state() private channels:Channel[]=[];
  @state() private programmes:Record<string,{current:Programme|null;next:Programme|null}>={};
  private timer?:number; private holdTimer?:number; private held=false; private lastTap=0;
  setConfig(config:CardConfig){if(!config.config_entry_id)throw new Error("config_entry_id is required");this.config={...config,channels:config.channels??[]};this.load();}
  connectedCallback(){super.connectedCallback();this.timer=window.setInterval(()=>this.load(),60000);}
  disconnectedCallback(){window.clearInterval(this.timer);super.disconnectedCallback();}
  private async load(){if(!this.hass||!this.config)return;const [channels,programmes]=await Promise.all([this.hass.callWS<Channel[]>({type:"advanced_tv_remote/channels",config_entry_id:this.config.config_entry_id}),this.hass.callWS<Record<string,{current:Programme|null;next:Programme|null}>>({type:"advanced_tv_remote/programs",config_entry_id:this.config.config_entry_id,channel_ids:this.config.channels.map(c=>c.channel_id)})]);this.channels=channels;this.programmes=programmes;}
  private action(index:number,kind:"tap"|"hold"|"double_tap"){const cfg=this.config?.channels[index];if(cfg&&this.hass)handleAction(this,this.hass as any,cfg as any,kind as any)}
  private down(index:number){this.held=false;this.holdTimer=window.setTimeout(()=>{this.held=true;this.action(index,"hold")},500)}
  private up(index:number){window.clearTimeout(this.holdTimer);if(this.held)return;const now=Date.now();if(now-this.lastTap<300){this.lastTap=0;this.action(index,"double_tap")}else{this.lastTap=now;window.setTimeout(()=>{if(this.lastTap===now)this.action(index,"tap")},310)}}
  render(){if(!this.config)return nothing;return html`<ha-card><h2>${this.config.title??"Guida TV"}</h2><div class="grid">${this.config.channels.map((item,i)=>{const channel=this.channels.find(c=>c.id===item.channel_id);const p=this.programmes[item.channel_id];return html`<button @pointerdown=${()=>this.down(i)} @pointerup=${()=>this.up(i)} @pointercancel=${()=>window.clearTimeout(this.holdTimer)}><div class="channel">${channel?.icon?html`<img src=${channel.icon}>`:nothing}<strong>${item.name??channel?.name??item.channel_id}</strong></div><div class="show"><b>Ora</b><span>${p?.current?.title??"Programmazione non disponibile"}</span>${p?.current?html`<small>${new Date(p.current.start).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}–${new Date(p.current.stop).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</small>`:nothing}</div><div class="next"><b>Dopo</b><span>${p?.next?.title??"—"}</span></div></button>`})}</div></ha-card>`}
  static styles=css`:host{display:block}ha-card{padding:16px}h2{margin:0 0 12px}.grid{display:grid;gap:10px}button{font:inherit;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;padding:12px;text-align:left;display:grid;grid-template-columns:minmax(110px,.7fr) 1.4fr 1fr;gap:16px;cursor:pointer}.channel,.show,.next{display:flex;align-items:center;gap:8px;min-width:0}.show,.next{align-items:flex-start;flex-direction:column}.show span,.next span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}img{width:42px;height:42px;object-fit:contain}small{color:var(--secondary-text-color)}@media(max-width:600px){button{grid-template-columns:1fr}.next{border-top:1px solid var(--divider-color);padding-top:8px}}`;
  static getConfigElement(){return document.createElement("advanced-tv-remote-card-editor")}
  static getStubConfig(){return {type:"custom:advanced-tv-remote-card",config_entry_id:"",channels:[]}}
}

@customElement("advanced-tv-remote-card-editor")
export class AdvancedTvRemoteCardEditor extends LitElement {
  @property({attribute:false}) hass?:HomeAssistant; @state() private config?:CardConfig; @state() private channels:Channel[]=[];
  setConfig(config:CardConfig){this.config={...config,channels:config.channels??[]};this.load()}
  private async load(){if(this.hass&&this.config?.config_entry_id)this.channels=await this.hass.callWS({type:"advanced_tv_remote/channels",config_entry_id:this.config.config_entry_id})}
  private changed(config:CardConfig){this.config=config;fire(this,"config-changed",{config})}
  private add(){if(!this.config)return;this.changed({...this.config,channels:[...this.config.channels,{channel_id:this.channels[0]?.id??"",tap_action:{action:"none"}}]})}
  private patch(index:number,key:string,value:unknown){if(!this.config)return;const channels=this.config.channels.map((c,i)=>i===index?{...c,[key]:value}:c);this.changed({...this.config,channels})}
  render(){if(!this.config)return nothing;return html`<div><ha-textfield label="Titolo" .value=${this.config.title??""} @change=${(e:any)=>this.changed({...this.config!,title:e.target.value})}></ha-textfield>${this.config.channels.map((c,i)=>html`<section><ha-select label="Canale" .value=${c.channel_id} @selected=${(e:any)=>this.patch(i,"channel_id",e.target.value)}>${this.channels.map(ch=>html`<mwc-list-item .value=${ch.id}>${ch.name}</mwc-list-item>`)}</ha-select>${(["tap_action","hold_action","double_tap_action"] as const).map(key=>html`<h4>${key.replaceAll("_"," ")}</h4><hui-action-editor .hass=${this.hass} .config=${c[key]??{action:"none"}} @value-changed=${(e:any)=>this.patch(i,key,e.detail.value)}></hui-action-editor>`)}<ha-button @click=${()=>this.changed({...this.config!,channels:this.config!.channels.filter((_,n)=>n!==i)})}>Rimuovi</ha-button></section>`)}<ha-button @click=${this.add}>Nuovo canale</ha-button></div>`}
  static styles=css`div{display:grid;gap:16px}section{border:1px solid var(--divider-color);border-radius:8px;padding:12px;display:grid;gap:8px}`;
}

declare global{interface Window{customCards?:unknown[]}}window.customCards=window.customCards??[];window.customCards.push({type:"advanced-tv-remote-card",name:"Advanced TV Remote",description:"Guida TV italiana con azioni per canale",preview:true});
