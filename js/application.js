// Wait till the browser is ready to render the game (avoids glitches)
$(document).ready(function () {
  console.log("READY!");
  window.requestAnimationFrame(function () {
    brain = new AutonomousBrain("http://brain-2048.herokuapp.com", 500, 3000);
    new GameManager(4, brain, KeyboardInputManager, HTMLActuator, LocalStorageManager);
  });
});
