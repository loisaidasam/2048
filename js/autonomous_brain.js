function AutonomousBrain() {
  // this.host = "http://brain-2048.herokuapp.com";
  this.host = "http://localhost:5000";
  this.nextMoveTimeout = 500;
  this.restartTimeout = 3000;
  this.maxRetries = 5;
  this.retrySleeptime = 2000;

  this.events = {};
  this.gameId = null;
  this.score = 0;
  this.board = null;
  this.paused = false;
}

AutonomousBrain.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

AutonomousBrain.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

AutonomousBrain.prototype.update = function (grid, terminated, score) {
  var self = this;

  if (terminated) {
    this.finish(score);
    return;
  }

  this.board = [];
  grid.cells.forEach(function (column) {
    column.forEach(function (cell) {
      if (cell) {
        self.board.push(cell.value);
      } else {
        self.board.push(0);
      }
    });
  });

  if (! this.paused) {
    this.callServer();
  }
};

AutonomousBrain.prototype.callServer = function () {
  var self = this;
  var nextMove = null;
  var boardStr = null;
  var retries = 0;

  if (! this.board) {
    return;
  }

  boardStr = this.board.join();

  function getNextMove() {
    var result = $.ajax({
      type: "GET",
      url: self.host + "/next",
      data: {
        id: self.gameId,
        board: boardStr,
      },
      async: false,
    }).responseText;
    result = parseInt(result)
    nextMove = isNaN(result) ? -1 : result;
    if (nextMove === -1) {
      if (retries < self.maxRetries) {
        console.log("Failed to get next move (" + (self.maxRetries - retries) + " retries left)");
        retries++;
        window.setTimeout(getNextMove, self.retrySleeptime);
      } else {
        console.log("Giving up after " + retries + " retries :(");
      }
    } else {
      console.log("boardStr: " + boardStr + " | nextMove: " + nextMove);
      window.setTimeout(function () {
        self.emit("move", nextMove);
      }, self.nextMoveTimeout);
    }
  }
  getNextMove();
};

AutonomousBrain.prototype.start = function () {
  this.gameId = $.ajax({
    type: "GET",
    url: this.host + "/start",
    async: false,
  }).responseText;
  console.log("Start result:" + this.gameId);
};

AutonomousBrain.prototype.finish = function (score) {
  var self = this;
  var response = null;

  console.log("Finished with score " + score);
  response = $.ajax({
    type: "GET",
    url: this.host + "/finish",
    data: {
      score: score,
      id: this.gameId,
    },
    async: false,
  }).responseText;

  console.log("Finish response:" + response);
  window.setTimeout(function () {
    self.restart();
  }, self.restartTimeout);
};

AutonomousBrain.prototype.restart = function() {
    this.emit("restart");
};

AutonomousBrain.prototype.pause = function () {
  this.paused = ! this.paused;
  if (! this.paused) {
    this.callServer();
  }
}