import { handleAction } from "custom-card-helpers";
import type { ChannelConfig, HomeAssistant, LovelaceActionConfig } from "./types";

export type ChannelAction = "tap" | "hold" | "double_tap";

export function hasChannelAction(config: ChannelConfig | undefined, kind: ChannelAction): boolean {
  const action = config?.[`${kind}_action`];
  return !!action && action.action !== "none";
}

/** Translate HA's current service-action fields to the helper's legacy API. */
export async function executeChannelAction(
  node: HTMLElement, hass: HomeAssistant, config: ChannelConfig, kind: ChannelAction,
): Promise<void> {
  const key = `${kind}_action` as const;
  const action = config[key];
  if (!action || action.action === "none") return;
  let normalized: LovelaceActionConfig = action;
  if (action.action === "perform-action" || action.action === "call-service") {
    const service = action.perform_action ?? action.service;
    if (!service || !/^[a-z0-9_]+\.[a-z0-9_]+$/.test(service)) {
      throw new Error("Seleziona un’azione Home Assistant valida (dominio.servizio).");
    }
    normalized = {
      ...action, action: "call-service", service,
      service_data: action.data ?? action.service_data,
    };
  }
  // The helper does not return the service promise. Capture it so failures can
  // be shown to the user instead of becoming unhandled rejections.
  let serviceCall: Promise<unknown> | undefined;
  const actionHass = Object.create(hass) as HomeAssistant;
  Object.defineProperty(actionHass, "callService", {
    value: (...args: Parameters<HomeAssistant["callService"]>) => {
      serviceCall = hass.callService(...args);
      return serviceCall;
    },
  });
  handleAction(node, actionHass as any, {
    ...config, entity: action.entity ?? config.entity, [key]: normalized,
  } as any, kind);
  await serviceCall;
}
