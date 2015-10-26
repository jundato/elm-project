module GreenGui.Main where

import Color exposing (..)
import Graphics.Collage exposing (..)
import Graphics.Element exposing (..)

type alias AppState = { monitors : List Monitor
                      }

type alias Monitor = {
  number : String
}

defaultAppState : AppState 
defaultAppState = {
  monitors = []
  } 

type Action 
  = NoOp
  | Increment 
  | Decrement

update : Action -> AppState -> AppState
update action appState =
  case action of
    NoOp -> appState
    Increment -> appState
    Decrement -> appState

main =
  Signal.map (view actions.address) appState

-- manage the appstate of our application over time
appState : Signal AppState
appState =
  Signal.foldp update defaultAppState actions.signal

-- actions from user input
actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp

view : Signal.Address Action -> AppState -> Element
view address appState = 
  collage 1024 600
    [(toForm (flow down
      [ show "By using the 'flow' function,"
      , show "we can stack elements"
      , show "on top of other elements."
      , show "on top of other elements."
      , show "on top of other elements."
      , show "on top of other elements."
      , show "on top of other elements."
      , show "on top of other elements."
      , show "on top of other elements.11"
      ]))]

monitorButtonPanel = [ ]

monitorButtons = [ ]