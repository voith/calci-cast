import json
import logging
from channels import Group
from channels.sessions import channel_session
from .models import Message

log = logging.getLogger(__name__)


@channel_session
def ws_connect(message):
    Group('chat', channel_layer=message.channel_layer).add(message.reply_channel)


@channel_session
def ws_receive(message):
    try:
        data = json.loads(message['text'])
    except ValueError:
        log.debug("ws message isn't json text=%s", message['text'])
        return

    if set(data.keys()) != set(('handle', 'message')):
        log.debug("ws message unexpected format data=%s", data)
        return

    if data:
        log.debug('chat message handle=%s message=%s',
                  data['handle'], data['message'])
        m = Message.objects.create(**data)

    Group('chat', channel_layer=message.channel_layer).send({'text': json.dumps(m.as_dict())})


@channel_session
def ws_disconnect(message):
    Group('chat', channel_layer=message.channel_layer).discard(message.reply_channel)
