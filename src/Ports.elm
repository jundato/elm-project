
port module Ports exposing (..)

import Types exposing (..)

--* PORTS IN *---
--main screen
port in_themeSelected : (String -> msg) -> Sub msg
port in_openSystemPreferences : (String -> msg) -> Sub msg
port in_returnToHomeMode: (String -> msg) -> Sub msg

--home screen
port in_longPressedMonitor : (Monitor -> msg) -> Sub msg
port in_unlockLockCountdown : (String -> msg) -> Sub msg
port in_updateLockCountdownSecondsLeft : (Int -> msg) -> Sub msg
port in_updateMonitor : (Monitor -> msg) -> Sub msg
port in_updateMonitorMaxDisplays : (Int -> msg) -> Sub msg

--monitor setup
port in_startEditingMonitor: (Monitor -> msg) -> Sub msg

--* PORTS OUT *--
-- home outgoing ports
port out_onPressedMonitor : Monitor -> Cmd msg
port out_onPressReleasedMonitor : String -> Cmd msg
port out_onLockScreenPressed : String -> Cmd msg
port out_onPressedSettings : String -> Cmd msg
port out_onSystemPreferencesOpen : String -> Cmd msg

-- monitor setup outgoing ports
port out_exitAndSaveMonitorChanges : Monitor -> Cmd msg
port out_returnToHomeMode : String -> Cmd msg

-- system preferences outgoing ports
port out_onThemeSelected : String -> Cmd msg
port out_onSystemPreferencesClose : String -> Cmd msg
port out_updateMonitorMaxDisplays : Int -> Cmd msg

--Testing temporaries
port toJS : String -> Cmd msg
port fromJS : (Int -> msg) -> Sub msg
