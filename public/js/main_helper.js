function main() {
  var elmDiv = document.getElementById('elm');

  var monitorPressTimer = 0;
  var monitorNumberPressed = '';

  var lockCountdownTimer = 0;

  var lockCountdownUpdateDuration = 200;
  var lockCountdownStart = '';

  var app = Elm.Main.fullscreen()

  app.ports.out_onPressedMonitor.subscribe(function(monitor) {

    monitorPressTimer = window.setTimeout(function() {
      console.log(monitor);
      app.ports.in_startEditingMonitor.send(monitor);
      app.ports.in_longPressedMonitor.send(monitor);
      app.ports.in_monitorSetup.send("");
    },1000);
  });

  app.ports.out_onManagePresets.subscribe(function(temp){
    app.ports.in_managePresets.send("");
  });

  app.ports.out_onPressReleasedMonitor.subscribe(function(temp){
    clearTimeout(monitorPressTimer);
  });

  app.ports.out_onLockScreenPressed.subscribe(function(temp){
    startLockCountdown();
    app.ports.in_lockScreen.send("");
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
        app.ports.in_returnToHomeMode.send("");
      }
      else{
        app.ports.in_updateSecondsLeft.send(countDownDuration - elapsed);
        lockCountdownTick();
      }
    },lockCountDownUpdateDuration);
  }

  app.ports.out_returnToHomeMode.subscribe(function(temp){
    app.ports.in_returnToHomeMode.send("");
  });

  app.ports.out_exitAndSaveMonitorChanges.subscribe(function(monitor){
    app.ports.in_updateMonitor.send(monitor);
    app.ports.in_returnToHomeMode.send("");
  });

  app.ports.out_onThemeSelected.subscribe(function(theme){
    app.ports.in_themeSelected.send(theme);
  });

  app.ports.out_presetSettingsClosed.subscribe(function(){
    app.ports.in_returnToHomeMode.send("");
  });

  app.ports.out_updateMonitorMaxDisplays.subscribe(function(monitorDisplays){
    app.ports.in_updateMonitorMaxDisplays.send(monitorDisplays);
  });

  app.ports.out_onSystemPreferencesOpen.subscribe(function(temporary){
    app.ports.in_openSystemPreferences.send("");
  });

  app.ports.out_onSystemPreferencesClose.subscribe(function(temporary){
    app.ports.in_returnToHomeMode.send("");
  });
  // var elm = Elm.embed(Elm.GreenGui.Main, elmDiv,  {
  //   in_longPressedMonitor: "",
  //   in_unlockLockCountdown: "",
  //   in_updateLockCountdownSecondsLeft: 0
  // });
  //
  // //functions coming from elm
  //
  // //simulates long presses on pressing monitors
  // //starts timer when a monitor on the home screen is pressed, if still pressed within the duration
  // //sends the pressed monitor inside elm
  // elm.ports.out_onPressedMonitor.subscribe(function (data) {
  //   monitorNumberPressed = data[0];
  //   monitorPressTimer = window.setTimeout(function() {
  //     elm.ports.in_longPressedMonitor.send(monitorNumberPressed);
  //   },1000);
  // });
  //
  // //clears the press monitor timer to prevent it from firing
  // elm.ports.out_onPressReleasedMonitor.subscribe(function (data) {
  //   clearTimeout(monitorPressTimer);
  // });
  //
  // elm.ports.out_onLockScreenPressed.subscribe(function() {
  //   console.log('lock pressed');
  //   startLockCountdown();
  //
  //   // cleanPressTimer = window.setTimeout(function() {
  //   //   elm.ports.inCleanPressTimerEnded.send();
  //   // },30000);
  // });
  //
  // var startLockCountdown = function(){
  //   lockCountdownStart = new Date();
  //   lockCountdownTick();
  // }
  //
  // var lockCountdownTick = function(){
  //   lockCountDownUpdateDuration = 200;
  //   countDownDuration = 30;
  //   window.setTimeout(function() {
  //     var currentLockdownTime = new Date();
  //     var elapsed = Math.floor((currentLockdownTime - lockCountdownStart) / 1000);
  //     if(elapsed >= countDownDuration){
  //       elm.ports.in_unlockLockCountdown.send("");
  //     }
  //     else{
  //       elm.ports.in_updateLockCountdownSecondsLeft.send(countDownDuration - elapsed);
  //       lockCountdownTick();
  //     }
  //   },lockCountDownUpdateDuration);
  // }
}
