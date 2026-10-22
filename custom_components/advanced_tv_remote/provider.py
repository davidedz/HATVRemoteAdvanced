from __future__ import annotations

import asyncio
import gzip
import logging
from datetime import datetime, timezone
from io import BytesIO
from xml.etree import ElementTree as ET

from aiohttp import ClientSession

from .models import Channel, Programme

_LOGGER = logging.getLogger(__name__)


def parse_xmltv_datetime(value: str) -> datetime:
    value = value.strip()
    for fmt in ("%Y%m%d%H%M%S %z", "%Y%m%d%H%M%S", "%Y%m%d%H%M %z", "%Y%m%d%H%M"):
        try:
            parsed = datetime.strptime(value, fmt)
            return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)
        except ValueError:
            continue
    raise ValueError(f"Unsupported XMLTV datetime: {value}")


def _text(element: ET.Element, name: str) -> str | None:
    child = element.find(name)
    return child.text.strip() if child is not None and child.text else None


def parse_xmltv(payload: bytes) -> tuple[dict[str, Channel], dict[str, list[Programme]]]:
    if payload[:2] == b"\x1f\x8b":
        payload = gzip.decompress(payload)
    channels: dict[str, Channel] = {}
    programmes: dict[str, list[Programme]] = {}
    for _, elem in ET.iterparse(BytesIO(payload), events=("end",)):
        if elem.tag == "channel":
            channel_id = elem.attrib["id"]
            icon = elem.find("icon")
            channels[channel_id] = Channel(
                id=channel_id,
                name=_text(elem, "display-name") or channel_id,
                icon=icon.attrib.get("src") if icon is not None else None,
            )
            elem.clear()
        elif elem.tag == "programme":
            try:
                item = Programme(
                    channel_id=elem.attrib["channel"],
                    start=parse_xmltv_datetime(elem.attrib["start"]),
                    stop=parse_xmltv_datetime(elem.attrib["stop"]),
                    title=_text(elem, "title") or "",
                    subtitle=_text(elem, "sub-title"),
                    description=_text(elem, "desc"),
                    category=_text(elem, "category"),
                )
                programmes.setdefault(item.channel_id, []).append(item)
            except (KeyError, ValueError) as err:
                _LOGGER.debug("Skipping invalid programme: %s", err)
            elem.clear()
    for items in programmes.values():
        items.sort(key=lambda item: item.start)
    return channels, programmes


class XmlTvProvider:
    def __init__(self, session: ClientSession, url: str) -> None:
        self._session = session
        self.url = url
        self.last_payload: bytes | None = None

    async def async_fetch(self) -> tuple[dict[str, Channel], dict[str, list[Programme]]]:
        self.last_payload = await self.async_download()
        return await asyncio.to_thread(parse_xmltv, self.last_payload)

    async def async_download(self) -> bytes:
        async with asyncio.timeout(60):
            async with self._session.get(self.url, headers={"Accept-Encoding": "gzip"}) as response:
                response.raise_for_status()
                return await response.read()
