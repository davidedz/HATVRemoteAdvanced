"""Resource registration tests, runnable without a Home Assistant installation."""
import asyncio
import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('card_frontend', Path(__file__).resolve().parents[1] / 'custom_components/advanced_tv_remote/frontend.py')
frontend = importlib.util.module_from_spec(spec)
spec.loader.exec_module(frontend)


class Hass:
    async def async_add_executor_job(self, func, *args):
        return func(*args)


class Resources:
    def __init__(self, items=()):
        self.items = list(items)
        self.writes = 0
    async def async_get_info(self):
        return {}
    def async_items(self):
        return self.items.copy()
    async def async_create_item(self, data):
        self.writes += 1
        self.items.append({'id': 'new', 'url': data['url'], 'type': data['res_type']})
    async def async_update_item(self, item_id, data):
        self.writes += 1
        self.items = [dict(item, url=data['url'], type=data['res_type']) if item['id'] == item_id else item for item in self.items]
    async def async_delete_item(self, item_id):
        self.writes += 1
        self.items = [item for item in self.items if item['id'] != item_id]


class FrontendTests(unittest.IsolatedAsyncioTestCase):
    async def test_create_and_repeat(self):
        resources = Resources()
        await frontend.async_register_card(Hass(), resources)
        self.assertEqual(len(resources.items), 1)
        self.assertEqual(resources.items[0]['type'], 'module')
        await frontend.async_register_card(Hass(), resources)
        self.assertEqual(resources.writes, 1)

    async def test_migrate_and_deduplicate(self):
        other = {'id': 'other', 'url': '/local/another.js', 'type': 'module'}
        resources = Resources([{'id': 'old', 'url': frontend.CARD_URL+'?v=0.2.0', 'type': 'js'}, {'id': 'duplicate', 'url': frontend.CARD_URL, 'type': 'module'}, other])
        await frontend.async_register_card(Hass(), resources)
        self.assertEqual(len(resources.items), 2)
        self.assertIn(other, resources.items)
        self.assertEqual(resources.items[0]['id'], 'old')
        self.assertEqual(resources.items[0]['type'], 'module')
        self.assertNotIn('0.2.0', resources.items[0]['url'])

    async def test_yaml_is_left_untouched(self):
        with self.assertLogs(frontend._LOGGER, level='WARNING'):
            await frontend.async_register_card(Hass(), object())

    def test_version_tracks_contents(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'card.js'
            path.write_text('first')
            first = frontend.card_resource_url(path)
            self.assertEqual(first, frontend.card_resource_url(path))
            path.write_text('second')
            self.assertNotEqual(first, frontend.card_resource_url(path))


if __name__ == '__main__':
    unittest.main()
