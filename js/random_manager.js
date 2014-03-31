
// Need to synchronize "random" data for deterministic results
function RandomManager() {
  this.randomPool = [];
}

RandomManager.prototype.setRandom = function (randomPool) {
  this.randomPool = randomPool;
};

RandomManager.prototype.getRandom = function () {
  if (this.randomPool.length === 0) {
    window.console.log("Empty random pool :(");
    return Math.random();
  }
  return this.randomPool.shift();
};

RandomManager.prototype.randomReady = function () {
  return this.randomPool.length !== 0;
};
