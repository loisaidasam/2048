#!/usr/bin/env python

import json
import random

from flask import Flask, render_template, request
from flask.ext.cacheify import init_cacheify
import pusher

import settings


class Game(object):
    ALLOWED_COMMANDS = ('up', 'right', 'down', 'left', 'restart')

    def __init__(self):
        self.moves = cache.get('moves') or []

    def restart(self):
        self.moves = []
        cache.set('moves', self.moves)

    def move(self, data):
        self.moves.append(data)
        cache.set('moves', self.moves)


app = Flask(__name__, static_url_path='', static_folder=settings.BASE_DIR)
cache = init_cacheify(app)
pusher_client = pusher.Pusher(app_id=settings.PUSHER_APP_ID,
                              key=settings.PUSHER_KEY,
                              secret=settings.PUSHER_SECRET)

game = Game()


def send_push(data):
    pusher_client[settings.PUSHER_CHANNEL].trigger('command', data)


@app.route('/')
def index():
    starting_moves = json.dumps(game.moves)
    return render_template('index.html', starting_moves=starting_moves)


@app.route("/api")
def api():
    sender = request.args.get('sender')
    command = request.args.get('command')
    print "%s: %s" % (sender, command)
    data = {
        'sender': sender,
        'command': command,
        'random': [random.random() for x in xrange(settings.RANDOM_NUMBERS_SIZE)],
    }
    if command in Game.ALLOWED_COMMANDS:
        if command == 'restart':
            game.restart()
        game.move(data)
        send_push(data)
    return "OK"


if __name__ == "__main__":
    app.debug = settings.DEBUG
    app.run(host=settings.HOST, port=settings.PORT)
