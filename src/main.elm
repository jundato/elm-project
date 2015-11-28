-- author: virgilio dato
-- temporary site : http://ghoulish-scarecrow-6363.herokuapp.com/
module GreenGui.Main where

import GreenGui.App exposing (..)

import StartApp.Simple exposing (start)

main : Signal Element
main =
  Signal.map (appView actions.address) appState 

-- manage the appState of our application over time
appState : Signal AppState
appState =
  Signal.foldp update defaultAppState actions

-- actions from user input
actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp

--mergedActions : Signal Action
--mergedActions = Signal.mergeMany [ actions.signal
--                , in_longPressedMonitor |> Signal.map LongPressedMonitor
--                ]

--pressedMonitor =
--  let needsMonitorPressedDown action =
--        case action of
--          MonitorPressedDown number -> True
--          _ -> False
--      toSelector action =
--        case action of
--          MonitorPressedDown number -> number
--          _ -> ""
--  in  actions.signal
--        |> Signal.filter needsMonitorPressedDown (MonitorPressedDown "")
--        |> Signal.map toSelector

--pressReleasedMonitor =  
--  let needsMonitorPressReleased action =
--        case action of
--          MonitorPressReleased number -> True
--          _ -> False
--      toSelector action =
--        case action of
--          MonitorPressReleased number -> number
--          _ -> ""
--  in  actions.signal
--        |> Signal.filter needsMonitorPressReleased (MonitorPressReleased "")
--        |> Signal.map toSelector


--mergedActions : Signal Action
--mergedActions = Signal.mergeMany [ actions.signal
--                , in_longPressedMonitor |> Signal.map LongPressedMonitor
--                ]

----* PORTS IN *---
--port in_longPressedMonitor : Signal String

----* PORTS OUT *--
--port out_onPressedMonitor : Signal String
--port out_onPressedMonitor = pressedMonitor


--port out_onPressReleasedMonitor : Signal String
--port out_onPressReleasedMonitor = pressReleasedMonitor

--port out_onReleasedMonitor : Signal SessionId
--port out_onReleasedMonitor = releasedMonitor
