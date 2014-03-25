function AutonomousBrain(host, nextMoveTimeout, restartTimeout) {
  this.host = host;
  this.nextMoveTimeout = nextMoveTimeout;
  this.restartTimeout = restartTimeout;
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

  if (! this.board) {
    return;
  }

  boardStr = this.board.join();
  nextMove = $.ajax({
    type: "GET",
    url: this.host + "/next",
    data: {
      id: this.gameId,
      board: boardStr,
    },
    async: false,
  }).responseText;

  console.log("boardStr: " + boardStr + " | nextMove: " + nextMove);
  window.setTimeout(function () {
    self.emit("move", nextMove);
  }, this.nextMoveTimeout);
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