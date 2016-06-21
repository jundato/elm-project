port module LockPorts exposing (..)

import Types exposing (..)

--* PORTS IN *---
port in_updateSecondsLeft: (Int -> msg ) -> Sub msg
