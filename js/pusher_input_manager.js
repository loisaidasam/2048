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
    var buttonText = data.sender + ": " + data.command;
    if (moveMap[data.command] !== undefined) {
      self.emit("move", moveMap[data.command], buttonText);
      return;
    }
    if (data.command === "restart") {
      self.emit("restart", buttonText);
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

PusherInputManager.prototype.emit = function (event, data1, data2) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data1, data2);
    });
  }
};
