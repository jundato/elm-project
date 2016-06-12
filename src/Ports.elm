
port module Ports exposing (
  in_longPressedMonitor, in_unlockLockCountdown, in_updateLockCountdownSecondsLeft,
  in_returnToHomeMode, in_startEditingMonitor, in_updateMonitor,
  out_onPressedMonitor, out_onPressReleasedMonitor, out_onLockScreenPressed,
  out_returnToHomeMode, out_exitAndSaveMonitorChanges,
  toJS, fromJS
  )

import Types exposing (..)

--* PORTS IN *---
--home screen
port in_longPressedMonitor : (Monitor -> msg) -> Sub msg
port in_unlockLockCountdown : (String -> msg) -> Sub msg
port in_updateLockCountdownSecondsLeft : (Int -> msg) -> Sub msg
port in_updateMonitor : (Monitor -> msg) -> Sub msg
port in_returnToHomeMode: (String -> msg) -> Sub msg

--monitor setup
port in_startEditingMonitor: (Monitor -> msg) -> Sub msg

--* PORTS OUT *--
port out_onPressedMonitor : Monitor -> Cmd msg
port out_onPressReleasedMonitor : String -> Cmd msg
port out_onLockScreenPressed : String -> Cmd msg
port out_exitAndSaveMonitorChanges : Monitor -> Cmd msg
port out_returnToHomeMode : String -> Cmd msg

--Testing temporaries
port toJS : String -> Cmd msg
port fromJS : (Int -> msg) -> Sub msg
