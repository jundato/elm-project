-- author: virgilio dato
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

-- app states model have screeen states that models what state each screen
-- 1) home screen
-- 2) monitor setting screen
type alias AppState = { currentScreenState : Int
                      , homeScreenState : HomeScreenState
                      , monitorSettingScreenState : MonitorSettingScreenState
                      
                      }

-- initial page that should be displayed, it contains the list of monitors, power down, etc.
type alias HomeScreenState =  { monitors : List Monitor
                              , monitorPageIndex : Int 
                              }

-- when a monitor is selected this screen state handles it
type alias MonitorSettingScreenState =  { selectedMonitor : Monitor }

-- model for monitor
type alias Monitor =  { number : String
                      , isSelected : Bool
                      , isVisible : Bool
                      , vgaOne : String
                      , vgaTwo : String
                      , dviOne : String
                      , dviTwo : String
                      , videoOne : String
                      , videoTwo : String
                      , videoThree : String
                      }

------ DEFAULT MODELS
defaultAppState : AppState 
defaultAppState = { currentScreenState = 2
                  , homeScreenState = defaultHomeScreenState
                  , monitorSettingScreenState = defaultMonitorSettingScreenState } 

defaultHomeScreenState : HomeScreenState
defaultHomeScreenState =  { monitorPageIndex = 0
                          , monitors =  [ defaultMonitor "1" True
                                        , defaultMonitor "2" True
                                        , defaultMonitor "3" True
                                        , defaultMonitor "4" True
                                        , defaultMonitor "5" True
                                        , defaultMonitor "6" False
                                        , defaultMonitor "7" False 
                                        , defaultMonitor "8" False
                                        , defaultMonitor "9" False
                                        , defaultMonitor "10" False
                                        , defaultMonitor "11" False
                                        , defaultMonitor "12" False ]
                          }

defaultMonitorSettingScreenState : MonitorSettingScreenState
defaultMonitorSettingScreenState  = { selectedMonitor = defaultMonitor "1" True }

defaultMonitor : String -> Bool -> Monitor
defaultMonitor number' isVisible' =  { number = number'
                          , isSelected = False
                          , isVisible = isVisible'
                          , vgaOne = ""
                          , vgaTwo = ""
                          , dviOne = ""
                          , dviTwo = ""
                          , videoOne = ""
                          , videoTwo = ""
                          , videoThree = ""
                          }

-- actions
type Action 
  = NoOp
  | SelectMonitor Monitor
  | SelectAllMonitors
  | SelectMonitorToConfigure Monitor
  | NextMonitorPage
  | PreviousMonitorPage

-- logic when an update signal is emitted
update : Action -> AppState -> AppState
update action appState =
  case action of
    NoOp -> appState
    SelectMonitor monitor -> 
      let homeScreenState' = appState.homeScreenState
      in { appState | homeScreenState <- { homeScreenState' | monitors <- setMonitorAsSelected monitor homeScreenState'.monitors } }
    SelectAllMonitors ->
      let homeScreenState' = appState.homeScreenState
      in { appState | homeScreenState <- { homeScreenState' | monitors <- setAllMonitorAsSelected homeScreenState'.monitors } }
    SelectMonitorToConfigure monitor' ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | currentScreenState <- 2
                    , monitorSettingScreenState <- { monitorSettingScreenState' | selectedMonitor <- monitor' } }
    --- Moves monitor page to the next page
    PreviousMonitorPage ->
      let monitorsPerPage = 5
          homeScreenState' = appState.homeScreenState
          maxFlips = ceiling ((toFloat (List.length homeScreenState'.monitors)) / monitorsPerPage)
      in { appState | homeScreenState <- flipMonitorPage -1 maxFlips monitorsPerPage homeScreenState' }
    NextMonitorPage ->
      let monitorsPerPage = 5
          homeScreenState' = appState.homeScreenState
          maxFlips = ceiling ((toFloat (List.length homeScreenState'.monitors)) / monitorsPerPage)
      in { appState | homeScreenState <- flipMonitorPage 1 maxFlips monitorsPerPage homeScreenState' }


------ CONVERSION FUNCTIONS
---- HOME SCREEN VIEW FUNCTIONS
-- sets the monitor to selected and returns the new list
setMonitorAsSelected : Monitor -> List Monitor -> List Monitor
setMonitorAsSelected monitor monitors = 
  List.map (\m -> if  | m.number == monitor.number -> { monitor | isSelected <- not monitor.isSelected }
                      | otherwise -> m ) monitors

-- sets all monitors to selected
setAllMonitorAsSelected : List Monitor -> List Monitor
setAllMonitorAsSelected  monitors = 
  List.map (\m -> { m | isSelected <- True } ) monitors

-- moves monitor pages left and right : negative for left, positive for right
flipMonitorPage : Int -> Int -> Int -> HomeScreenState -> HomeScreenState
flipMonitorPage flips maxFlips monitorsPerPage homeScreenState =
  let monitors' = homeScreenState.monitors
      newPageIndex = clamp 0 (maxFlips - 1) (homeScreenState.monitorPageIndex + flips)
      
  in 
    { homeScreenState | monitorPageIndex <- newPageIndex 
                      , monitors <- (List.indexedMap (setVisibilityByPageIndex newPageIndex monitorsPerPage) monitors') }

-- set visibility of page by index
setVisibilityByPageIndex : Int -> Int -> Int -> Monitor -> Monitor
setVisibilityByPageIndex newPageIndex monitorsPerPage index monitor = 
  let isVisible' = if  | index // monitorsPerPage == newPageIndex -> True
                      | otherwise -> False
  in { monitor | isVisible <- isVisible' }
  

--- entry point
main : Signal Element
main =
  Signal.map2 (appView actions.address) appState Window.dimensions 

-- manage the appState of our application over time
appState : Signal AppState
appState =
  Signal.foldp update defaultAppState actions.signal

-- actions from user input
actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp

------ VIEWS
---- Main View
-- app view handles which screen state view is being displayed
appView :Address Action -> AppState -> (Int,Int) -> Element
appView address appState (w,h) =
  let homeScreenState = appState.homeScreenState
      monitorSettingScreenState = appState.monitorSettingScreenState
      viewToDisplay = case appState.currentScreenState of
                        1 -> homeScreenView address homeScreenState
                        2 -> monitorSettingScreenView address monitorSettingScreenState
                        _ -> div [] [ text "nothing to display" ]
  in viewToDisplay |> toElement w h
---- Main View
-- home screen view
homeScreenView address homeScreenState =
  div []  [ monitorPanelView address homeScreenState.monitors
          , homePanelView address 
          , homeMenuView address
  ] 
-- monitor panel view contains buttons container and pager
monitorPanelView address monitors =  
  div [ class "monitor-panel-view" ]  [ div [ class "monitor-views" ] ( monitorViewButtons address monitors )
                                                , monitorViewPager address ]

-- list of monitor buttons
monitorViewButtons address monitors = 
  (List.map (monitorViewButton address) monitors)

--- view of a monitor button
monitorViewButton address monitor = 
  let visibility = if | monitor.isVisible /= True -> "hidden"
                      | otherwise -> ""
      isHighlighted = if | monitor.isSelected -> "selected"
                         | otherwise -> ""
  in
    div [ class ("monitor-view-container " ++ visibility) ]
    [ div [ class (isHighlighted ++ " " ++ "monitor-view" ), onClick address (SelectMonitor monitor)]  
          [ div [ class "monitor-button-body" ] 
                [ p [ class "monitor-button-label" ] [ text monitor.number ] ]
    , div [ class "monitor-button-configuration" ] [ img [ class "monitor-configure-icon", src "images/gear_icon.svg", onClick address (SelectMonitorToConfigure monitor) ] [] ] ]]

--- view of a monitor view pager, it is located at the upper portion of the screen
monitorViewPager address = div  [ class "monitor-pager-view" ]
                                [ div [ class "monitor-pager-button-view align-left", onClick address PreviousMonitorPage ] [ img [ class "monitor-pager-icon", src "images/left_arrow_icon.svg" ] [ ]]
                                , div [ class "monitor-selectall-view" ] [ div [ class "monitor-selectall-graphic" ] [ ]
                                                                         , div [ class "monitor-selectall-container"] [ div [ class "monitor-selectall-button", onClick address SelectAllMonitors] [ text "SELECT ALL"] ] ] 
                                , div [ class "monitor-pager-button-view align-right", onClick address NextMonitorPage ] [ img [ class "monitor-pager-icon", src "images/right_arrow_icon.svg" ] [ ]]]

--- view of the home panel, the home panel is located on the center of the screen
homePanelView address = div [ class "home-panel-view" ] 
                                    [ div [ class "home-panel-division" ] [ img [ class "home-panel-button", src "images/power_button.svg" ] [ ] ]
                                    , div [ class "home-panel-division" ] [ div []  [ div [ ] [ img [  class "home-panel-count-button", src "images/increment_button.svg" ] [] ]
                                                                                    , div [ class "home-panel-count-label" ] [ text "BRIGHTNESS" ] 
                                                                                    , div [ ] [ img [ class "home-panel-count-button", src "images/decrement_button.svg" ] [] ] ] ]
                                    , div [ class "home-panel-division" ] [ img [ class "home-panel-button", src "images/night_mode_button.svg" ] [ ]]
                                    , div [ class "home-panel-division" ] [ img [ class "home-panel-button", src "images/preset_button.svg" ] [ ]] ]

--- view of menus of the home panel, it is located at the bottom of the screen
homeMenuView address = div [ class "sub-panel-view" ] [ div [ class "home-menu-item" ] [ text "lock" ]
                                                      , div [ class "home-menu-item" ] [ text "menu" ]
                                                      , div [ class "home-menu-item" ] [ text "information" ] ] 


---- Monitor Setting View
-- monitor view
monitorSettingScreenView address monitorSettingScreenState = 
  div [ ] [ monitorSettingTopBarView address monitorSettingScreenState
          , monitorSettingBodyView address monitorSettingScreenState ]

-- top bar for monitor setting view
monitorSettingTopBarView address monitorSettingScreenState = 
  div [ class "app-top-bar" ] [ text ("MONITOR " ++ (toString monitorSettingScreenState.selectedMonitor.number)) ]

-- main body for monitor setting view
monitorSettingBodyView address monitorSettingScreenState = 
  div [ class "app-body" ]  [ monitorSettingUpperBodyView address monitorSettingScreenState
                            , monitorSettingLowerBodyView address monitorSettingScreenState ]

-- monitor setting upper body view
monitorSettingUpperBodyView address monitorSettingScreenState =
  let monitor = monitorSettingScreenState.selectedMonitor
  in div [ class "monitor-setting-upper-body" ] [ div  [ class "monitor-setting-division" ] [ signalMatrixView address "VGA 1" monitor.vgaOne
                                                                                            , signalMatrixView address "VGA 2" monitor.vgaTwo ]
                                                , div [ class "monitor-setting-division" ]  [ signalMatrixView address "DVI 1" monitor.dviOne
                                                                                            , signalMatrixView address "DVI 2" monitor.dviTwo ]
                                                , div [ class "monitor-setting-division" ]  [ signalMatrixView address "VIDEO 1" monitor.videoOne
                                                                                            , signalMatrixView address "VIDEO 2" monitor.videoTwo
                                                                                            , signalMatrixView address "VIDEO 3" monitor.vgaOne ]]

-- monitor lower body view
monitorSettingLowerBodyView address monitorSettingScreenState = 
  div [ class "monitor-setting-lower-body" ] [ div [ class "monitor-setting-button-panel" ] [ div [ class "monitor-button-container" ] [ img [ class "monitor-button", src "images/cycle_button.svg" ] [ ] ]
                                                                                            , div [ class "monitor-button-container" ] [ img [ class "monitor-button", src "images/pip_button.svg" ] [ ] ] 
                                                                                            , div [ class "monitor-button-container" ] [ img [ class "monitor-button", src "images/osd_button.svg" ] [ ] ]] 
                                             , div [ class "osd-buttons-panel" ] [ ] ]

-- signal matrix view
signalMatrixView address signalType signalName = 
  div [ class "signal-matrix-view" ]  [ div [ class "signal-matrix-label" ] [ text signalType ]
                                                            , div [ class "signal-matrix-container" ] [ div [ class "signal-text-box" ] [ input [ type' "text", value signalType ][ ] ]
                                                                                                      , div [ class "matrix-button" ] [ text "MATRIX" ] ]] 
