from __future__ import annotations

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.const import CONF_URL
from homeassistant.core import callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import CONF_CACHE_HOURS, CONF_UPDATE_INTERVAL, DEFAULT_CACHE_HOURS, DEFAULT_UPDATE_INTERVAL, DOMAIN
from .provider import XmlTvProvider


class AdvancedTvRemoteConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        errors = {}
        if user_input:
            try:
                await XmlTvProvider(async_get_clientsession(self.hass), user_input[CONF_URL]).async_fetch()
            except Exception:
                errors["base"] = "cannot_connect"
            else:
                await self.async_set_unique_id(user_input[CONF_URL])
                self._abort_if_unique_id_configured()
                return self.async_create_entry(title="Italian TV Guide", data=user_input)
        schema = vol.Schema({vol.Required(CONF_URL): str, vol.Optional(CONF_UPDATE_INTERVAL, default=DEFAULT_UPDATE_INTERVAL): vol.All(vol.Coerce(int), vol.Range(min=15, max=1440)), vol.Optional(CONF_CACHE_HOURS, default=DEFAULT_CACHE_HOURS): vol.All(vol.Coerce(int), vol.Range(min=1, max=168))})
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return AdvancedTvRemoteOptionsFlow(config_entry)


class AdvancedTvRemoteOptionsFlow(config_entries.OptionsFlow):
    def __init__(self, config_entry):
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)
        current = {**self.config_entry.data, **self.config_entry.options}
        return self.async_show_form(step_id="init", data_schema=vol.Schema({vol.Optional(CONF_UPDATE_INTERVAL, default=current.get(CONF_UPDATE_INTERVAL, DEFAULT_UPDATE_INTERVAL)): vol.All(vol.Coerce(int), vol.Range(min=15, max=1440)), vol.Optional(CONF_CACHE_HOURS, default=current.get(CONF_CACHE_HOURS, DEFAULT_CACHE_HOURS)): vol.All(vol.Coerce(int), vol.Range(min=1, max=168))}))

