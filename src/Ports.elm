
port module Ports exposing (
  in_longPressedMonitor, in_unlockLockCountdown,in_updateLockCountdownSecondsLeft,
  out_onPressedMonitor, out_onPressReleasedMonitor, out_onLockScreenPressed,
  toJS, fromJS
  )

--* PORTS IN *---
port in_longPressedMonitor : (String -> msg) -> Sub msg
port in_unlockLockCountdown : (String -> msg) -> Sub msg
port in_updateLockCountdownSecondsLeft : (Int -> msg) -> Sub msg

--* PORTS OUT *--
port out_onPressedMonitor : String -> Cmd msg
port out_onPressReleasedMonitor : String -> Cmd msg
port out_onLockScreenPressed : String -> Cmd msg

port toJS : String -> Cmd msg
port fromJS : (Int -> msg) -> Sub msg
