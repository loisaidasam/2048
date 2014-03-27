function PusherInputManager() {
  this.pusherKey = "8655799553dbf4825655";
  this.pusherChannel = "test_channel";

  this.events = {};
  this.randomPool = [];

  Pusher.log = function (message) {
    if (window.console && window.console.log) {
      window.console.log(message);
    }
  };

  var pusher = new Pusher(this.pusherKey);
  var channel = pusher.subscribe(this.pusherChannel);
  var self = this;
  channel.bind("command", function (data) {
    window.console.log("Pusher update!");
    window.console.log(data);
    self.randomPool = data.random;
    var moveMap = {
      "up": 0,
      "right": 1,
      "down": 2,
      "left": 3,
    };
    if (moveMap[data.command] !== undefined) {
      self.changeText(data.sender + ": " + data.command);
      self.emit("move", moveMap[data.command]);
      return;
    }
    if (data.command === "restart") {
      self.changeText(data.sender + ": restart");
      self.emit("restart");
      return;
    }
  });
}

PusherInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

PusherInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

PusherInputManager.prototype.changeText = function (text) {
  document.getElementById("restart-button").innerHTML = text;
};

// Need to synchronize "random" data for deterministic results
PusherInputManager.prototype.getRandom = function () {
  if (this.randomPool.length === 0) {
    window.console.log("Empty random pool :(");
    return Math.random();
  }
  return this.randomPool.shift();
};

PusherInputManager.prototype.randomReady = function () {
  return this.randomPool.length !== 0;
};
