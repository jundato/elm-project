port module MainPorts exposing (..)

--* PORTS IN *---
port in_monitorSetup: (String -> msg) -> Sub msg
port in_openSystemPreferences : (String -> msg) -> Sub msg
port in_returnToHomeMode: (String -> msg) -> Sub msg
port in_lockScreen : (String -> msg) -> Sub msg
port in_managePresets : (String -> msg) -> Sub msg
