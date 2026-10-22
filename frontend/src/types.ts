export interface HomeAssistant { callWS<T>(message: Record<string, unknown>): Promise<T>; callService(domain: string, service: string, data?: Record<string, unknown>, target?: Record<string, unknown>): Promise<unknown>; }
export interface LovelaceActionConfig { action: "more-info"|"toggle"|"call-service"|"perform-action"|"fire-dom-event"|"navigate"|"url"|"assist"|"none"; perform_action?:string; service?:string; data?:Record<string,unknown>; service_data?:Record<string,unknown>; target?:Record<string,unknown>; entity?:string; [key:string]: unknown; }
export interface ChannelConfig { channel_id:string; name?:string; entity?:string; tap_action?:LovelaceActionConfig; hold_action?:LovelaceActionConfig; double_tap_action?:LovelaceActionConfig; }
export interface CardConfig { type:string; title?:string; config_entry_id?:string; channels:ChannelConfig[]; compact?:boolean; }
export interface Programme { title:string; start:string; stop:string; subtitle?:string; description?:string; }
export interface Channel { id:string; name:string; icon?:string; }
export interface EpgSource { entry_id:string; title:string; url:string; }
