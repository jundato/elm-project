function main() {
  var elmDiv = document.getElementById('elm');

  var monitorPressTimer = 0;
  var monitorNumberPressed = '';

  var cleanPressTimer = 0;

  var elm = Elm.embed(Elm.GreenGui.Main, elmDiv,  {
    in_longPressedMonitor: ""
  });

  //functions coming from elm

  //simulates long presses on pressing monitors
  //starts timer when a monitor on the home screen is pressed, if still pressed within the duration
  //sends the pressed monitor inside elm
  elm.ports.out_onPressedMonitor.subscribe(function (data) {
    monitorNumberPressed = data[0];
    monitorPressTimer = window.setTimeout(function() { 
      elm.ports.in_longPressedMonitor.send(monitorNumberPressed);
    },500);
  });

  //clears the press monitor timer to prevent it from firing
  elm.ports.out_onPressReleasedMonitor.subscribe(function (data) {
    clearTimeout(monitorPressTimer);
  });

  elm.ports.out_onLockScreenPressed.subscribe(function() {
    console.log('lock pressed')
    // cleanPressTimer = window.setTimeout(function() { 
    //   elm.ports.inCleanPressTimerEnded.send();
    // },30000);
  });
}