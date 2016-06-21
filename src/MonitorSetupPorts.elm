port module MonitorSetupPorts exposing (..)

import Types exposing(..)
--* PORTS IN *---
port in_startEditingMonitor: (Monitor -> msg) -> Sub msg

--* PORTS OUT *---
port out_exitAndSaveMonitorChanges : Monitor -> Cmd msg
port out_returnToHomeMode : String -> Cmd msg
