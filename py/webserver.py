#!/usr/bin/env python

import os
import random
import uuid

from flask import Flask, request


class Game(object):
    """Class for maintaining game state
    """

    CHOICES = (0, 1, 2, 3)

    def __init__(self, id=None):
        self.id = id or str(uuid.uuid4())
        self.moves = {}
        self.total_moves = 0
        self.score = None

    def update(self, board):
        if not board in self.moves:
            self.moves[board] = []
        choice = random.choice(Game.CHOICES)
        self.moves[board].append(choice)
        self.total_moves += 1
        return choice

    def finish(self, score):
        self.score = score
        print "After %s total moves, received score of %s" % (self.total_moves, self.score)


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
