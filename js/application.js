// Wait till the browser is ready to render the game (avoids glitches)
$(document).ready(function () {
  console.log("READY!");
  window.requestAnimationFrame(function () {
    new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager, AutonomousBrain);
  });
});
