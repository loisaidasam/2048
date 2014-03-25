// Wait till the browser is ready to render the game (avoids glitches)
$(document).ready(function () {
  console.log("READY!");
  window.requestAnimationFrame(function () {
    actuator = new HTMLActuator("http://localhost:5000")
    new GameManager(4, KeyboardInputManager, actuator, LocalStorageManager);
  });
});
