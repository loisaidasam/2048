#!/usr/bin/env python

import os
import random

from flask import Flask, request


class Game(object):
    """Class for maintaining game state
    """

    CHOICES = (0, 1, 2, 3)

    def __init__(self):
        self.init()

    def init(self):
        self.moves = {}
        self.total_moves = 0
        self.score = None

    def add_position(self, board, choice):
        if not board in self.moves:
            self.moves[board] = []
        self.moves[board].append(choice)
        self.total_moves += 1

    def finish(self, score):
        self.score = score
        print "After %s total moves, received score of %s" % (self.total_moves, self.score)


PY_DIR = os.path.dirname(os.path.realpath(__file__))
BASE_DIR = os.path.join(PY_DIR, '..')
app = Flask(__name__, static_url_path='', static_folder=BASE_DIR)
game = Game()


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route("/start")
def start():
    game.init()
    return "OK"


@app.route("/next")
def next():
    board = tuple(request.args.get('board', '').split(','))
    choice = random.choice(Game.CHOICES)
    game.add_position(board, choice)
    return str(choice)


@app.route("/finish")
def finish():
    score = request.args.get('score')
    game.finish(score)
    return "OK"


if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=5000)
