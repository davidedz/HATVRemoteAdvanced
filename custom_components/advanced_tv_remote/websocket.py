from __future__ import annotations

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .const import DOMAIN, WS_CHANNELS, WS_PROGRAMS


@websocket_api.websocket_command({vol.Required("type"): WS_CHANNELS, vol.Required("config_entry_id"): str})
@websocket_api.async_response
async def websocket_channels(hass: HomeAssistant, connection, msg):
    coordinator = hass.data[DOMAIN][msg["config_entry_id"]]
    connection.send_result(msg["id"], [channel.as_dict() for channel in coordinator.channels.values()])


@websocket_api.websocket_command({vol.Required("type"): WS_PROGRAMS, vol.Required("config_entry_id"): str, vol.Required("channel_ids"): [str]})
@websocket_api.async_response
async def websocket_programs(hass: HomeAssistant, connection, msg):
    coordinator = hass.data[DOMAIN][msg["config_entry_id"]]
    result = {}
    for channel_id in msg["channel_ids"]:
        current, following = coordinator.programme_pair(channel_id)
        result[channel_id] = {"current": current.as_dict() if current else None, "next": following.as_dict() if following else None}
    connection.send_result(msg["id"], result)


def async_register(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, websocket_channels)
    websocket_api.async_register_command(hass, websocket_programs)

