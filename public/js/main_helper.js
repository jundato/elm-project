function main() {
  var elmDiv = document.getElementById('elm');

  var pressTimer = 0;
  var monitorNumberPressed = '';
  var elm = Elm.embed(Elm.GreenGui.Main, elmDiv,  {
    in_longPressedMonitor: ""
  });

  // $("a").mouseup(function(){
  //   clearTimeout(pressTimer)
  //   // Clear timeout
  //   return false;
  // }).mousedown(function(){
  //   // Set timeout
  //   pressTimer = window.setTimeout(function() { ... your code ...},1000)
  //   return false; 
  // });

  //functions coming from elm
  elm.ports.out_onPressedMonitor.subscribe(function (data) {
    monitorNumberPressed = data[0];
    pressTimer = window.setTimeout(function() { 
      elm.ports.in_longPressedMonitor.send(monitorNumberPressed);
    },500);
  });
  elm.ports.out_onPressReleasedMonitor.subscribe(function (data) {
    
    clearTimeout(pressTimer);
  });
  // elm.ports.out_onReleasedMonitor.subscribe(function (data) {
  //   var monitor = data[0];
  // });
}