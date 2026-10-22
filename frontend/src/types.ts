export interface HomeAssistant { callWS<T>(message: Record<string, unknown>): Promise<T>; }
export interface LovelaceActionConfig { action: "more-info"|"toggle"|"call-service"|"navigate"|"url"|"assist"|"none"; [key:string]: unknown; }
export interface ChannelConfig { channel_id:string; name?:string; tap_action?:LovelaceActionConfig; hold_action?:LovelaceActionConfig; double_tap_action?:LovelaceActionConfig; }
export interface CardConfig { type:string; title?:string; config_entry_id:string; channels:ChannelConfig[]; compact?:boolean; }
export interface Programme { title:string; start:string; stop:string; subtitle?:string; description?:string; }
export interface Channel { id:string; name:string; icon?:string; }
