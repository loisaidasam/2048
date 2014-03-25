
import random
import uuid

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
