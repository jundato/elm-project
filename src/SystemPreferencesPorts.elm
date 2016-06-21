
port module SystemPreferencesPorts exposing (..)

import Types exposing (..)

--* PORTS OUT *--
port out_onThemeSelected : String -> Cmd msg
port out_onSystemPreferencesClose : String -> Cmd msg
port out_updateMonitorMaxDisplays : Int -> Cmd msg
