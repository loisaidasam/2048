#!/usr/bin/env python

import random

from flask import Flask, request
import pusher

import settings


app = Flask(__name__, static_url_path='', static_folder=settings.BASE_DIR)
pusher_client = pusher.Pusher(app_id=settings.PUSHER_APP_ID,
                              key=settings.PUSHER_KEY,
                              secret=settings.PUSHER_SECRET)

def send_push(sender, command):
    data = {
        'sender': sender,
        'command': command,
        'random': [random.random() for x in xrange(settings.RANDOM_NUMBERS_SIZE)],
    }
    pusher_client[settings.PUSHER_CHANNEL].trigger('command', data)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route("/api")
def api():
    send_push(request.args.get('sender'), request.args.get('command'))
    return "OK"


if __name__ == "__main__":
    app.debug = settings.DEBUG
    app.run(host=settings.HOST, port=settings.PORT)
