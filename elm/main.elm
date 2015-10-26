module GreenGui.Main where

import Color exposing (..)
import Graphics.Collage exposing (..)
import Graphics.Element exposing (..)
import Graphics.Input exposing (..)

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

monitor : String -> Monitor
monitor number' = {
  number = number'
  }

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
    [ move (0,-55) blueSquare
    , (toForm (button (Signal.message address NoOp) "1"))
    ]

monitorButtonPanel : Signal.Address Action -> AppState -> Element
monitorButtonPanel address appstate = 
  flow right  [ button (Signal.message address NoOp) "1"
              , button (Signal.message address NoOp) "2"
              , button (Signal.message address NoOp) "+"
              ]

monitorButtons = [ ]

blueSquare : Form
blueSquare =
  traced (dashed blue) square

square : Path
square =
  path [ (50,50), (50,-50), (-50,-50), (-50,50), (50,50) ]
