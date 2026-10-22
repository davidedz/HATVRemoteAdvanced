from datetime import timezone
from custom_components.advanced_tv_remote.provider import parse_xmltv


def test_parse_xmltv():
    data=b'''<tv><channel id="rai1"><display-name>Rai 1</display-name><icon src="https://example/rai1.png"/></channel><programme channel="rai1" start="20260101120000 +0000" stop="20260101130000 +0000"><title lang="it">TG1</title><category>News</category></programme></tv>'''
    channels,programmes=parse_xmltv(data)
    assert channels["rai1"].name=="Rai 1"
    assert programmes["rai1"][0].title=="TG1"
    assert programmes["rai1"][0].start.tzinfo==timezone.utc
