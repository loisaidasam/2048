
import csv
import os
import random
import uuid

import settings


class Game(object):
    """Class for maintaining game state
    """

    CHOICES = (0, 1, 2, 3)

    def __init__(self, id=None):
        self.id = id or str(uuid.uuid4())
        self.moves = []
        self.score = None

    def update(self, board):
        choice = random.choice(Game.CHOICES)
        self.moves.append((board, choice))
        return choice

    def finish(self, score):
        self.score = score
        print "After %s total moves, received score of %s" % (len(self.moves), self.score)

        filename = os.path.join(settings.GAMES_DIR, "%s_%s.csv" % (self.id, self.score))
        with open(filename, 'w') as fp:
            writer = csv.writer(fp)
            for board, choice in self.moves:
                writer.writerow([board, choice])
