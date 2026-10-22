"""Register the card and invalidate browser caches when its contents change."""
from __future__ import annotations

from hashlib import sha256
import logging
from pathlib import Path
from urllib.parse import urlsplit

_LOGGER = logging.getLogger(__name__)
CARD_URL = "/advanced_tv_remote/advanced-tv-remote-card.js"


def card_resource_url(path: Path) -> str:
    """Use the bundle contents, rather than a manually maintained version."""
    return f"{CARD_URL}?v={sha256(path.read_bytes()).hexdigest()[:16]}"


async def async_register_card(hass, resources) -> None:
    """Create or migrate our resource without touching unrelated resources."""
    if not hasattr(resources, "async_create_item"):
        _LOGGER.warning(
            "Lovelace resources are managed in YAML; keep the card resource at %s "
            "and reload the browser after updates", CARD_URL
        )
        return
    await resources.async_get_info()
    url = await hass.async_add_executor_job(
        card_resource_url, Path(__file__).parent / "www" / "advanced-tv-remote-card.js"
    )
    matches = [
        item for item in resources.async_items()
        if urlsplit(item.get("url", "")).path == CARD_URL
        and not urlsplit(item.get("url", "")).netloc
    ]
    if not matches:
        await resources.async_create_item({"res_type": "module", "url": url})
        return
    first, *duplicates = matches
    if first.get("url") != url or first.get("type") != "module":
        await resources.async_update_item(first["id"], {"res_type": "module", "url": url})
    for item in duplicates:
        await resources.async_delete_item(item["id"])
