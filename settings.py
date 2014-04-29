
import os

BASE_DIR = os.path.dirname(os.path.realpath(__file__))

DEBUG = True
HOST = "0.0.0.0"
PORT = 5000

PUSHER_APP_ID = os.environ['PUSHER_APP_ID']
PUSHER_KEY = os.environ['PUSHER_KEY']
PUSHER_SECRET = os.environ['PUSHER_SECRET']
PUSHER_CHANNEL = os.environ['PUSHER_CHANNEL']

RANDOM_NUMBERS_SIZE = 4

REDIS_URL = os.environ['REDISCLOUD_URL']
