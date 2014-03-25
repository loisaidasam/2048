
import os

PY_DIR = os.path.dirname(os.path.realpath(__file__))
BASE_DIR = os.path.join(PY_DIR, '..')
GAMES_DIR = os.path.join(BASE_DIR, 'games')

HOST = "0.0.0.0"
PORT = 5000
DEBUG = True

STORE_GAMES = False

try:
    from localsettings import *
except:
    pass
