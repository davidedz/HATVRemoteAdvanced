from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .models import Channel, Programme
from .provider import XmlTvProvider, parse_xmltv


class EpgCoordinator(DataUpdateCoordinator[dict[str, list[Programme]]]):
    def __init__(self, hass: HomeAssistant, provider: XmlTvProvider, entry_id: str, interval: int, cache_hours: int) -> None:
        super().__init__(hass, logger=__import__("logging").getLogger(__name__), name="Advanced TV Remote EPG", update_interval=timedelta(minutes=interval))
        self.provider = provider
        self.channels: dict[str, Channel] = {}
        self.cache_path = Path(hass.config.path(".storage", f"advanced_tv_remote_{entry_id}.xml"))
        self.cache_ttl = timedelta(hours=cache_hours)

    async def _async_update_data(self) -> dict[str, list[Programme]]:
        try:
            channels, programmes = await self.provider.async_fetch()
            self.channels = channels
            if self.provider.last_payload is not None:
                await self.hass.async_add_executor_job(self._write_cache, self.provider.last_payload)
            return programmes
        except Exception as err:
            cached = await self.hass.async_add_executor_job(self._read_cache)
            if cached is not None:
                self.channels, programmes = parse_xmltv(cached)
                return programmes
            raise UpdateFailed(f"Unable to update XMLTV data and no valid cache is available: {err}") from err

    def _write_cache(self, payload: bytes) -> None:
        self.cache_path.parent.mkdir(parents=True, exist_ok=True)
        self.cache_path.write_bytes(payload)

    def _read_cache(self) -> bytes | None:
        if not self.cache_path.exists():
            return None
        age = dt_util.utcnow().replace(tzinfo=None) - datetime.fromtimestamp(self.cache_path.stat().st_mtime)
        return self.cache_path.read_bytes() if age <= self.cache_ttl else None

    def programme_pair(self, channel_id: str, now: datetime | None = None) -> tuple[Programme | None, Programme | None]:
        now = now or dt_util.now()
        items = self.data.get(channel_id, []) if self.data else []
        current = next((p for p in items if p.start <= now < p.stop), None)
        following = next((p for p in items if p.start >= (current.stop if current else now)), None)
        return current, following
