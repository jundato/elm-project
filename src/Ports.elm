
port module Ports exposing (
  in_longPressedMonitor, in_unlockLockCountdown,in_updateLockCountdownSecondsLeft,
  in_returnToHomeMode,
  out_onPressedMonitor, out_onPressReleasedMonitor, out_onLockScreenPressed,
  out_returnToHomeMode,
  toJS, fromJS
  )

--* PORTS IN *---
port in_longPressedMonitor : (String -> msg) -> Sub msg
port in_unlockLockCountdown : (String -> msg) -> Sub msg
port in_updateLockCountdownSecondsLeft : (Int -> msg) -> Sub msg
port in_returnToHomeMode: (String -> msg) -> Sub msg

--* PORTS OUT *--
port out_onPressedMonitor : String -> Cmd msg
port out_onPressReleasedMonitor : String -> Cmd msg
port out_onLockScreenPressed : String -> Cmd msg

port out_returnToHomeMode : String -> Cmd msg

--Testing temporaries
port toJS : String -> Cmd msg
port fromJS : (Int -> msg) -> Sub msg
