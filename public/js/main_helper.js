function main() {
  var elmDiv = document.getElementById('elm');

  var monitorPressTimer = 0;
  var monitorNumberPressed = '';

  var lockCountdownTimer = 0;

  var lockCountdownUpdateDuration = 200;
  var lockCountdownStart = '';

  var elm = Elm.embed(Elm.GreenGui.Main, elmDiv,  {
    in_longPressedMonitor: "",
    in_unlockLockCountdown: "",
    in_updateLockCountdownSecondsLeft: 0
  });

  //functions coming from elm

  //simulates long presses on pressing monitors
  //starts timer when a monitor on the home screen is pressed, if still pressed within the duration
  //sends the pressed monitor inside elm
  elm.ports.out_onPressedMonitor.subscribe(function (data) {
    monitorNumberPressed = data[0];
    monitorPressTimer = window.setTimeout(function() {
      elm.ports.in_longPressedMonitor.send(monitorNumberPressed);
    },1000);
  });

  //clears the press monitor timer to prevent it from firing
  elm.ports.out_onPressReleasedMonitor.subscribe(function (data) {
    clearTimeout(monitorPressTimer);
  });

  elm.ports.out_onLockScreenPressed.subscribe(function() {
    console.log('lock pressed');
    startLockCountdown();

    // cleanPressTimer = window.setTimeout(function() {
    //   elm.ports.inCleanPressTimerEnded.send();
    // },30000);
  });

  var startLockCountdown = function(){
    lockCountdownStart = new Date();
    lockCountdownTick();
  }

  var lockCountdownTick = function(){
    lockCountDownUpdateDuration = 200;
    countDownDuration = 30;
    window.setTimeout(function() {
      var currentLockdownTime = new Date();
      var elapsed = Math.floor((currentLockdownTime - lockCountdownStart) / 1000);
      if(elapsed >= countDownDuration){
        elm.ports.in_unlockLockCountdown.send("");
      }
      else{
        elm.ports.in_updateLockCountdownSecondsLeft.send(countDownDuration - elapsed);
        lockCountdownTick();
      }
    },lockCountDownUpdateDuration);
  }
}
