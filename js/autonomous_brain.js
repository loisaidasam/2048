function AutonomousBrain(host, nextMoveTimeout, restartTimeout) {
  this.host = host
  this.nextMoveTimeout = nextMoveTimeout;
  this.restartTimeout = restartTimeout;
  this.events = {};
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
  var boardStr = null;

  if (! this.board) {
    return;
  }

  boardStr = this.board.join()
  $.get(
    this.host + "/next",
    {
      board: boardStr,
    },
    function (data, textStatus, jqXHR) {
      console.log("boardStr: " + boardStr + " | next move: " + data);
      window.setTimeout(function () {
        self.emit("move", data);
      }, self.nextMoveTimeout);
    }
  );
};

AutonomousBrain.prototype.start = function () {
  var self = this;

  $.get(this.host + "/start", {},
  function (data, textStatus, jqXHR) {
    console.log("Start result:" + data);
    self.emit("restart");
  });
};

AutonomousBrain.prototype.finish = function (score) {
  var self = this;

  console.log("Finished with score " + score);
  $.get(this.host + "/finish", {score: score},
    function (data, textStatus, jqXHR) {
      console.log("Finish result:" + data);
      window.setTimeout(function () {
        self.start();
      }, self.restartTimeout);
    }
  );
};

AutonomousBrain.prototype.pause = function () {
  this.paused = ! this.paused;
  if (! this.paused) {
    this.callServer();
  }
}