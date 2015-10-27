module GreenGui.Main where

import Window
import Graphics.Element exposing (Element, color)
import Graphics.Input exposing (..)
import Graphics.Input as Input
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Lazy exposing (lazy, lazy2, lazy3)
import Signal exposing (..)
import Time
import List
import Html.Lazy exposing (lazy, lazy2, lazy3)
import Basics
import String
import Debug

type alias AppState = { monitors : List Monitor
                      , displayedMonitors : List Monitor
                      }

type alias Monitor = {
  number : String
  }

defaultAppState : AppState 
defaultAppState = { monitors = []
                  , displayedMonitors = [ defaultMonitor "1", defaultMonitor "2", defaultMonitor "3", defaultMonitor "4", defaultMonitor "5", defaultMonitor "6"]
                  } 

type Action 
  = NoOp
  | Increment 
  | Decrement

defaultMonitor : String -> Monitor
defaultMonitor number' = {
  number = number'
  }

update : Action -> AppState -> AppState
update action appState =
  case action of
    NoOp -> appState
    Increment -> appState
    Decrement -> appState

main : Signal Element
main =
  Signal.map2 (appView actions.address) appState Window.dimensions 

-- manage the appstate of our application over time
appState : Signal AppState
appState =
  Signal.foldp update defaultAppState actions.signal

-- actions from user input
actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp

appView :Address Action -> AppState -> (Int,Int) -> Element
appView address appState (w,h) =  
  div [] [
    div [] (List.map (monitorButton address) appState.displayedMonitors)
  ] |> toElement w h

monitorButton address monitor = div [ class "monitor-view" ] [ div [] [ text monitor.number ]
                                       , div [] [ img [ class "monitor-icon", src "images/gear_icon.svg" ] [] ] ]