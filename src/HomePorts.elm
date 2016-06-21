port module HomePorts exposing (..)

import Types exposing (..)

--* PORTS IN *---
port in_longPressedMonitor : (Monitor -> msg) -> Sub msg
port in_unlockLockCountdown : (String -> msg) -> Sub msg
port in_updateLockCountdownSecondsLeft : (Int -> msg) -> Sub msg
port in_updateMonitor : (Monitor -> msg) -> Sub msg
port in_updateMonitorMaxDisplays : (Int -> msg) -> Sub msg

--* PORTS OUT *---
port out_onPressedMonitor : Monitor -> Cmd msg
port out_onPressReleasedMonitor : String -> Cmd msg
port out_onLockScreenPressed : String -> Cmd msg
port out_onPressedSettings : String -> Cmd msg
port out_onSystemPreferencesOpen : String -> Cmd msg
port out_onScreenLock : String -> Cmd msg
port out_onManagePresets : String -> Cmd msg
