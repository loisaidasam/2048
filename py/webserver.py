#!/usr/bin/env python

from flask import Flask, request

from game import Game
import settings


app = Flask(__name__, static_url_path='', static_folder=settings.BASE_DIR)
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


@app.after_request
def inject_header(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == "__main__":
    app.debug = settings.DEBUG
    app.run(host=settings.HOST, port=settings.PORT)
