#!/usr/bin/env python

import os

from flask import Flask, request

from game import Game


PY_DIR = os.path.dirname(os.path.realpath(__file__))
BASE_DIR = os.path.join(PY_DIR, '..')
app = Flask(__name__, static_url_path='', static_folder=BASE_DIR)
games = {}


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route("/start")
def start():
    game = Game()
    games[game.id] = game
    return game.id


@app.route("/next")
def next():
    id = request.args.get('id')
    board = tuple(request.args.get('board', '').split(','))
    game = games.get(id) or Game(id)
    choice = game.update(board)
    return str(choice)


@app.route("/finish")
def finish():
    id = request.args.get('id')
    if not id in games:
        return "GAME NOT FOUND"
    score = request.args.get('score')
    games[id].finish(score)
    return "OK"


if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=5000)
