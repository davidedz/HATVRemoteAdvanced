from __future__ import annotations

from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.const import CONF_URL
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import CONF_CACHE_HOURS, CONF_UPDATE_INTERVAL, DEFAULT_CACHE_HOURS, DEFAULT_UPDATE_INTERVAL, DOMAIN
from .coordinator import EpgCoordinator
from .provider import XmlTvProvider
from .websocket import async_register


async def async_setup(hass, config):
    hass.data.setdefault(DOMAIN, {})
    await hass.http.async_register_static_paths(
        [StaticPathConfig("/advanced_tv_remote", str(Path(__file__).parent / "www"), False)]
    )
    async_register(hass)
    return True


async def async_setup_entry(hass, entry):
    values = {**entry.data, **entry.options}
    coordinator = EpgCoordinator(hass, XmlTvProvider(async_get_clientsession(hass), values[CONF_URL]), entry.entry_id, values.get(CONF_UPDATE_INTERVAL, DEFAULT_UPDATE_INTERVAL), values.get(CONF_CACHE_HOURS, DEFAULT_CACHE_HOURS))
    await coordinator.async_config_entry_first_refresh()
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator
    entry.async_on_unload(entry.add_update_listener(_async_reload_entry))
    return True


async def async_unload_entry(hass, entry):
    hass.data[DOMAIN].pop(entry.entry_id, None)
    return True


async def _async_reload_entry(hass, entry):
    await hass.config_entries.async_reload(entry.entry_id)
