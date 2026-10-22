from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime


@dataclass(slots=True, frozen=True)
class Channel:
    id: str
    name: str
    icon: str | None = None

    def as_dict(self) -> dict:
        return asdict(self)


@dataclass(slots=True, frozen=True)
class Programme:
    channel_id: str
    start: datetime
    stop: datetime
    title: str
    subtitle: str | None = None
    description: str | None = None
    category: str | None = None

    def as_dict(self) -> dict:
        data = asdict(self)
        data["start"] = self.start.isoformat()
        data["stop"] = self.stop.isoformat()
        return data

