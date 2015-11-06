-- author: virgilio dato
-- temporary site : http://ghoulish-scarecrow-6363.herokuapp.com/
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
import Json.Decode as Json

-- app states model have screeen states that models what state each screen
-- 1) home screen
-- 2) monitor setting screen
-- 3) preset setting screen
type alias AppState = { currentScreenState : Int
                      , homeScreenState : HomeScreenState
                      , monitorSettingScreenState : MonitorSettingScreenState
                      , presetSettingScreenState : PresetSettingScreenState
                      }

-- initial page that should be displayed, it contains the list of monitors, power down, etc.
type alias HomeScreenState =  { monitors : List Monitor
                              , monitorPageIndex : Int 
                              , isPowerDisabled : Bool
                              }

-- when a monitor is selected this screen state handles it
type alias MonitorSettingScreenState =  { selectedMonitor : Monitor
                                        , isCyclePressed : Bool
                                        , isPipSetPressed : Bool
                                        , isOsdSetPressed : Bool
                                        , isCycleDisabled : Bool
                                        , isPipDisabled : Bool
                                        , isOsdDisabled : Bool }

-- stores presets for monitors etc
type alias PresetSettingScreenState = { presets : List Preset }

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
                      , isVgaOneCycle : Bool
                      , isVgaTwoCycle : Bool
                      , isDviOneCycle : Bool
                      , isDviTwoCycle : Bool
                      , isVideoOneCycle : Bool
                      , isVideoTwoCycle : Bool
                      , isVideoThreeCycle : Bool
                      , isPipUpDownPressed : Bool
                      , isPipLeftRightPressed : Bool
                      , isPipResizePressed : Bool
                      , isOsdUpDownPressed : Bool
                      , isOsdLeftRightPressed : Bool
                      , isOsdSelectPressed : Bool
                      , isOn : Bool
                      }

type alias Preset = { id : Int
                    , name : String 
                    , tempName : String
                    , monitors : List Monitor 
                    , isSelected : Bool
                    , isEditingName : Bool }

------ DEFAULT MODELS
-- model for the whole app
defaultAppState : AppState 
defaultAppState = { currentScreenState = 1
                  , homeScreenState = defaultHomeScreenState
                  , monitorSettingScreenState = defaultMonitorSettingScreenState
                  , presetSettingScreenState = defaulPresetSettingScreenState } 

-- model for home screen
defaultHomeScreenState : HomeScreenState
defaultHomeScreenState =  { monitorPageIndex = 0
                          , isPowerDisabled = True
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
-- model for monitor settings screen 
defaultMonitorSettingScreenState : MonitorSettingScreenState
defaultMonitorSettingScreenState  = { selectedMonitor = defaultMonitor "1" True
                                    , isCyclePressed = False
                                    , isPipSetPressed = False
                                    , isOsdSetPressed = False
                                    , isCycleDisabled = False
                                    , isPipDisabled = False
                                    , isOsdDisabled = False }

-- model for preset setttings screen
defaulPresetSettingScreenState : PresetSettingScreenState
defaulPresetSettingScreenState = { presets =  [ defaultPreset 1
                                              , defaultPreset 2 
                                              , defaultPreset 3
                                              , defaultPreset 4
                                              , defaultPreset 5
                                              , defaultPreset 6 ] }

-- model for monitors
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
                          , isVgaOneCycle = False
                          , isVgaTwoCycle = False
                          , isDviOneCycle = False
                          , isDviTwoCycle = False
                          , isVideoOneCycle = False
                          , isVideoTwoCycle = False
                          , isVideoThreeCycle = False
                          , isPipUpDownPressed = False
                          , isPipLeftRightPressed = False
                          , isPipResizePressed = False
                          , isOsdUpDownPressed = False
                          , isOsdLeftRightPressed = False
                          , isOsdSelectPressed = False
                          , isOn = False
                          }

-- model for presets
defaultPreset : Int -> Preset
defaultPreset id' = { id = id'
                    , name = "PRE-SET"
                    , tempName = ""
                    , monitors = []
                    , isSelected = False
                    , isEditingName = False }


-- actions
type Action 
  = NoOp
-- home screen actions
  | SelectMonitor Monitor
  | SelectAllMonitors
  | MonitorPressedDown String
  | MonitorPressReleased String
  | LongPressedMonitor String
  | SelectMonitorToConfigure Monitor
  | NextMonitorPage
  | PreviousMonitorPage
  | PowerPress
  | PresetPress
-- monitor setting actions
  | CloseMonitorConfiguration
  | CycleButtonPress
  | PipButtonPress
  | OsdButtonPress
  | ActivateCycleSignalMatrixPress String
  | PipUpDownButtonPress
  | PipLeftRightButtonPress
  | PipResizeButtonPress
  | OsdUpDownButtonPress
  | OsdLeftRightButtonPress
  | OsdSelectButtonPress
-- * types : VGA 1, VGA 2, DVI 1, DVI 2, VIDEO 1, VIDEO 2, VIDEO 3
  | SignalInputChange String String
-- preset setting actions
  | ClosePresetSettings
  | PresetSelected Preset
  | PresetEdit Preset
  | PresetCommitThenSelect Preset
  | PresetNameInput Preset String
  | PresetEditCancel Preset

-- logic when an update signal is emitted
update : Action -> AppState -> AppState
update action appState =
  case action of
    NoOp -> appState
---- Home Screen Actions
    SelectMonitor monitor -> 
      let homeScreenState' = appState.homeScreenState
          monitors' = toggleMonitorAsSelected monitor homeScreenState'.monitors
          powerMustBeDisabled = if List.length (List.filter (\m -> m.isSelected ) monitors') > 0 then False else True
      in { appState | homeScreenState <- { homeScreenState' | monitors <- monitors'
                                                            , isPowerDisabled <- powerMustBeDisabled } }
    SelectAllMonitors ->
      let homeScreenState' = appState.homeScreenState
      in { appState | homeScreenState <- { homeScreenState' | monitors <- setAllMonitorAsSelected homeScreenState'.monitors
                                                            , isPowerDisabled <- False } }
    SelectMonitorToConfigure monitor' ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
          homeScreenState' = appState.homeScreenState
      in { appState | currentScreenState <- 2
                    , homeScreenState <- { homeScreenState' | monitors <- setMonitorAsSelected monitor' homeScreenState'.monitors }
                    , monitorSettingScreenState <- { monitorSettingScreenState' | selectedMonitor <- monitor'
                                                                                , isPipSetPressed <- False
                                                                                , isOsdSetPressed <- False } }
    MonitorPressedDown number -> appState
    MonitorPressReleased number -> appState
    LongPressedMonitor number -> 
      let monitorSettingScreenState' = appState.monitorSettingScreenState
          homeScreenState' = appState.homeScreenState
          foundMonitor = findMonitor number homeScreenState'.monitors
      in { appState | currentScreenState <- 2
                    , homeScreenState <- { homeScreenState' | monitors <- setMonitorAsSelected foundMonitor homeScreenState'.monitors }
                    , monitorSettingScreenState <- { monitorSettingScreenState' | selectedMonitor <- foundMonitor
                                                                                , isPipSetPressed <- False
                                                                                , isOsdSetPressed <- False } }
 
    PowerPress ->
      let homeScreenState' = appState.homeScreenState
      in { appState | homeScreenState <- { homeScreenState' | monitors <- setSelectedMonitorsToPowerPress homeScreenState'.monitors } }
    PresetPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | currentScreenState <- 3 }
-- Moves monitor page to the next page
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
---- Monitor Setting Actions
    CloseMonitorConfiguration ->
      let homeScreenState' = appState.homeScreenState
          monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | currentScreenState <- 1
                    , homeScreenState <- { homeScreenState' | monitors <- updateMonitorList monitorSettingScreenState'.selectedMonitor homeScreenState'.monitors } }
    SignalInputChange signalType value ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
          monitor' = monitorSettingScreenState'.selectedMonitor
      in { appState | monitorSettingScreenState <- { monitorSettingScreenState' | selectedMonitor <- setSignalInputChange signalType value monitor' } }
    CycleButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in if | not monitorSettingScreenState'.isCycleDisabled -> { appState | monitorSettingScreenState <- setCycleButtonPress monitorSettingScreenState' }
            | otherwise -> appState
    PipButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in if | not monitorSettingScreenState'.isPipDisabled -> { appState | monitorSettingScreenState <- setPipButtonPress monitorSettingScreenState' }
            | otherwise -> appState
    OsdButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in if | not monitorSettingScreenState'.isOsdDisabled -> { appState | monitorSettingScreenState <- setOsdButtonPress monitorSettingScreenState' }
            | otherwise -> appState
    ActivateCycleSignalMatrixPress signalType ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in if | monitorSettingScreenState'.isCyclePressed -> { appState | monitorSettingScreenState <- { monitorSettingScreenState' | selectedMonitor <- activateCycleSignalMatrix signalType monitorSettingScreenState'.selectedMonitor } }
            | otherwise -> appState
    PipUpDownButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | monitorSettingScreenState <- setPipUpDownButtonPress monitorSettingScreenState' }
    PipLeftRightButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | monitorSettingScreenState <- setPipLeftRightButtonPress monitorSettingScreenState' }
    PipResizeButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | monitorSettingScreenState <- setPipResizeButtonPress monitorSettingScreenState' }
    OsdUpDownButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | monitorSettingScreenState <- setOsdUpDownButtonPress monitorSettingScreenState' }
    OsdLeftRightButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | monitorSettingScreenState <- setOsdLeftRightButtonPress monitorSettingScreenState' }
    OsdSelectButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | monitorSettingScreenState <- setOsdSelectButtonPress monitorSettingScreenState' }
---- Preset setting action
    ClosePresetSettings ->
      { appState | currentScreenState <- 1 }
    PresetSelected preset ->
      let homeScreenState' = appState.homeScreenState
      in { appState | homeScreenState <- { homeScreenState' | monitors <- preset.monitors } }
    PresetEdit preset ->
      let presetSettingScreenState' = appState.presetSettingScreenState
      in { appState | presetSettingScreenState <- { presetSettingScreenState' | presets  <- setPresetToEdit preset presetSettingScreenState'.presets } }
    PresetCommitThenSelect preset ->
      let presetSettingScreenState' = appState.presetSettingScreenState
          monitors = appState.homeScreenState.monitors
      in { appState | presetSettingScreenState <- { presetSettingScreenState' | presets  <- setPresetCommitThenSelect preset monitors presetSettingScreenState'.presets } }
    PresetNameInput preset value ->
      let presetSettingScreenState' = appState.presetSettingScreenState
      in { appState | presetSettingScreenState <- { presetSettingScreenState' | presets <- setPresetName preset value presetSettingScreenState'.presets } }
    PresetEditCancel preset ->
      let presetSettingScreenState' = appState.presetSettingScreenState
      in { appState | presetSettingScreenState <- { presetSettingScreenState' | presets <- cancelPresetEdit preset presetSettingScreenState'.presets}}

------ CONVERSION FUNCTIONS
---- HOME SCREEN VIEW FUNCTIONS
-- sets the monitor to selected and returns the new list
setMonitorAsSelected : Monitor -> List Monitor -> List Monitor
setMonitorAsSelected monitor monitors = 
  List.map (\m -> if  | m.number == monitor.number -> { monitor | isSelected <- not True }
                      | otherwise -> { m | isSelected <- False } ) monitors

-- negates the value of wether the monitor selected or not
toggleMonitorAsSelected : Monitor -> List Monitor -> List Monitor
toggleMonitorAsSelected monitor monitors = 
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

-- sets a monitor as selected
setSelectedMonitorsToPowerPress : List Monitor -> List Monitor
setSelectedMonitorsToPowerPress monitors =
  List.map (\m -> if | m.isSelected -> { m | isOn <- not m.isSelected }
                     | otherwise -> m ) monitors

-- finds and returns a monitor if not returns a default
findMonitor : String -> List Monitor -> Monitor
findMonitor number monitors = 
  case List.take 1 (List.filter (\m -> m.number == number) monitors) of
    [monitor] -> monitor
    _ -> defaultMonitor "-1" False

-- set visibility of page by index
setVisibilityByPageIndex : Int -> Int -> Int -> Monitor -> Monitor
setVisibilityByPageIndex newPageIndex monitorsPerPage index monitor = 
  let isVisible' = if  | index // monitorsPerPage == newPageIndex -> True
                      | otherwise -> False
  in { monitor | isVisible <- isVisible' }

---- MONITOR SETTING FUNCTION
-- updates monitor on list
updateMonitorList : Monitor -> List Monitor -> List Monitor
updateMonitorList monitor monitors =
  List.map (\m -> if m.number ==  monitor.number then { monitor | isSelected <- True }  else m ) monitors

-- set signal input depending on control
-- VGA 1, VGA 2, DVI 1, DVI 2, VIDEO 1, VIDEO 2, VIDEO 3
setSignalInputChange : String -> String -> Monitor -> Monitor
setSignalInputChange signalType value monitor =
  let newMonitor = case signalType of
                                "VGA 1" -> { monitor | vgaOne <- value } 
                                "VGA 2" -> { monitor | vgaTwo <- value }  
                                "DVI 1" -> { monitor | dviOne <- value }  
                                "DVI 2" -> { monitor | dviTwo <- value } 
                                "VIDEO 1" -> { monitor | videoOne <- value } 
                                "VIDEO 2" -> { monitor | videoTwo <- value } 
                                "VIDEO 3" -> { monitor | videoThree <- value } 
  in newMonitor

-- toggle cycle button
setCycleButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setCycleButtonPress monitorSettingScreenState =
  { monitorSettingScreenState | isCyclePressed <- not monitorSettingScreenState.isCyclePressed
                              , isPipDisabled <- if not monitorSettingScreenState.isCyclePressed then True else False
                              , isOsdDisabled <- if not monitorSettingScreenState.isCyclePressed then True else False
                              }
-- toggles pip button and sets the rest to false
setPipButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setPipButtonPress monitorSettingScreenState =
  { monitorSettingScreenState | isPipSetPressed <- not monitorSettingScreenState.isPipSetPressed
                              , isOsdSetPressed <- False
                              , isCycleDisabled <- if not monitorSettingScreenState.isPipSetPressed then True else False
                              }

-- toggles osd button and sets the rest to false
setOsdButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setOsdButtonPress monitorSettingScreenState =
  { monitorSettingScreenState | isPipSetPressed <- False
                              , isOsdSetPressed <- not monitorSettingScreenState.isOsdSetPressed
                              , isCycleDisabled <- if not monitorSettingScreenState.isOsdSetPressed then True else False
                              }

-- toggle signal matrix button
activateCycleSignalMatrix : String -> Monitor -> Monitor
activateCycleSignalMatrix signalType monitor =
  let newMonitor = case signalType of
                                "VGA 1" -> { monitor | isVgaOneCycle <- not monitor.isVgaOneCycle } 
                                "VGA 2" -> { monitor | isVgaTwoCycle <- not monitor.isVgaTwoCycle }  
                                "DVI 1" -> { monitor | isDviOneCycle <- not monitor.isDviOneCycle }  
                                "DVI 2" -> { monitor | isDviTwoCycle <- not monitor.isDviTwoCycle } 
                                "VIDEO 1" -> { monitor | isVideoOneCycle <- not monitor.isVideoOneCycle } 
                                "VIDEO 2" -> { monitor | isVideoTwoCycle <- not monitor.isVideoTwoCycle } 
                                "VIDEO 3" -> { monitor | isVideoThreeCycle <- not monitor.isVideoThreeCycle } 
  in newMonitor

-- toggles pip butons
setPipUpDownButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setPipUpDownButtonPress monitorSettingScreenState =
  let monitor = monitorSettingScreenState.selectedMonitor 
  in { monitorSettingScreenState | selectedMonitor <- { monitor |  isPipUpDownPressed <- not monitor.isPipUpDownPressed }}
setPipLeftRightButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setPipLeftRightButtonPress monitorSettingScreenState = 
  let monitor = monitorSettingScreenState.selectedMonitor 
  in { monitorSettingScreenState | selectedMonitor <- { monitor |  isPipLeftRightPressed <- not monitor.isPipLeftRightPressed }}
setPipResizeButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setPipResizeButtonPress monitorSettingScreenState = 
  let monitor = monitorSettingScreenState.selectedMonitor 
  in { monitorSettingScreenState | selectedMonitor <- { monitor |  isPipResizePressed <- not monitor.isPipResizePressed }}

-- toggle osd buttons
setOsdUpDownButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setOsdUpDownButtonPress monitorSettingScreenState = 
  let monitor = monitorSettingScreenState.selectedMonitor 
  in { monitorSettingScreenState | selectedMonitor <- { monitor |  isOsdUpDownPressed <- not monitor.isOsdUpDownPressed }}
setOsdLeftRightButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setOsdLeftRightButtonPress monitorSettingScreenState = 
  let monitor = monitorSettingScreenState.selectedMonitor 
  in { monitorSettingScreenState | selectedMonitor <- { monitor |  isOsdLeftRightPressed <- not monitor.isOsdLeftRightPressed }}
setOsdSelectButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setOsdSelectButtonPress monitorSettingScreenState = 
  let monitor = monitorSettingScreenState.selectedMonitor 
  in { monitorSettingScreenState | selectedMonitor <- { monitor |  isOsdSelectPressed <- not monitor.isOsdSelectPressed }}

--List.map (\m -> if m.number ==  monitor.number then monitor else m ) monitors
---- PRESET SETTING FUNCTIONS
setPresetToEdit : Preset -> List Preset -> List Preset
setPresetToEdit preset presets =
  List.map (\p -> if  | p.id == preset.id -> { p  | isEditingName <- not p.isEditingName
                                                  , tempName <- p.name } 
                      | otherwise -> { p  | isEditingName <- False
                                          , tempName <- "" } ) presets

setPresetCommitThenSelect : Preset -> List Monitor -> List Preset -> List Preset
setPresetCommitThenSelect preset monitors presets =
  List.map (\p -> if  | p.id == preset.id -> { p  | name <- p.tempName
                                                  , isEditingName <- False
                                                  , monitors <- monitors } 
                      | otherwise -> p ) presets

cancelPresetEdit : Preset -> List Preset -> List Preset
cancelPresetEdit preset presets =
  List.map (\p -> if  | p.id == preset.id -> { p | isEditingName <- False }
                      | otherwise -> p ) presets


setPresetName : Preset -> String -> List Preset -> List Preset
setPresetName preset value presets =
  List.map (\p -> if  | p.id == preset.id -> { p | tempName <- value } 
                      | otherwise -> p ) presets
--- entry point
main : Signal Element
main =
  Signal.map2 (appView actions.address) appState Window.dimensions 

-- manage the appState of our application over time
appState : Signal AppState
appState =
  Signal.foldp update defaultAppState mergedActions

-- actions from user input
actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp

mergedActions : Signal Action
mergedActions = Signal.mergeMany [ actions.signal
                , in_longPressedMonitor |> Signal.map LongPressedMonitor
                ]

------ VIEWS
---- Main View
-- app view handles which screen state view is being displayed
appView :Address Action -> AppState -> (Int,Int) -> Element
appView address appState (w,h) =
  let homeScreenState = appState.homeScreenState
      monitorSettingScreenState = appState.monitorSettingScreenState
      presetSettingScreenState = appState.presetSettingScreenState
      viewToDisplay = case appState.currentScreenState of
                        1 -> homeScreenView address homeScreenState
                        2 -> monitorSettingScreenView address monitorSettingScreenState
                        3 -> presetSettingScreenView address presetSettingScreenState
                        _ -> div [] [ text "nothing to display" ]
  in viewToDisplay |> toElement w h
---- Main View
-- home screen view
homeScreenView address homeScreenState =
  div []  [ monitorPanelView address homeScreenState.monitors
          , homePanelView address homeScreenState
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
    div [ class ("div-1-5 monitor-view-container " ++ visibility ) ]
    [ div [ class (isHighlighted ++ " " ++ "monitor-view content-centered" )
          , onClick address (SelectMonitor monitor)
          , onDoubleClick address (SelectMonitorToConfigure monitor)
          , onMouseDown address (MonitorPressedDown monitor.number)
          , onMouseUp address (MonitorPressReleased monitor.number) ]  
          [  p [ class "monitor-button-label" ] [ text monitor.number ] ]
    ]

--- view of a monitor view pager, it is located at the upper portion of the screen
monitorViewPager address = 
  div [ class "monitor-pager-view" ]
      [ div [ class "div-1-10 vdiv-1-1" ] [ ]
      , div [ class "div-4-5" ] [ div [ class "align-left div-1-10", onClick address PreviousMonitorPage ] [ img [ class "monitor-pager-icon", src "images/left_arrow_icon.svg" ] [ ]]
                , div [ class "monitor-selectall-view div-4-5" ]  [ div [ class "monitor-selectall-graphic" ] [ ]
                                                                  , div [ class "monitor-selectall-container"] [ div [ class "monitor-selectall-button", onClick address SelectAllMonitors] [ div [ class "content-centered" ] [ text "SELECT ALL" ] ] ] ]
                , div [ class "align-right div-1-10", onClick address NextMonitorPage ] [ img [ class "monitor-pager-icon", src "images/right_arrow_icon.svg" ] [ ]]]
      , div [ class "div-1-10 vdiv-1-1" ] [ ]
      ]

--- view of the home panel, the home panel is located on the center of the screen
homePanelView address homeScreenState = 
  let powerButtonState = if homeScreenState.isPowerDisabled then "disabled" else ""
  in div  [ class "home-panel-view" ] 
          [ div [ class "home-panel-division div-1-4 vdiv-1-1" ] 
                [ div [ class ("home-panel-button circle button content-centered power " ++ powerButtonState), onClick address PowerPress ] 
                      [ text "POWER" ] ] 
          , div [ class "home-panel-division div-1-4" ] [ div [ class "home-panel-brightness-panel" ]  [ div [ ] [ img [  class "home-panel-count-button", src "images/increment_button.svg" ] [] ]
                                                          , div [ class "home-panel-count-label content-centered" ] [ text "BRIGHTNESS" ] 
                                                          , div [ ] [ img [ class "home-panel-count-button", src "images/decrement_button.svg" ] [] ] ] ]
          , div [ class "home-panel-division div-1-4 vdiv-1-1" ] 
                [ div [ class "home-panel-button circle button content-centered night-mode" ] [ text "NIGHT MODE" ]]
          , div [ class "home-panel-division div-1-4 vdiv-1-1" ] 
                [ div [ class "home-panel-button circle button content-centered presets", onClick address PresetPress ] [ text "PRESET" ]] ]

--- view of menus of the home panel, it is located at the bottom of the screen
homeMenuView address = div [ class "sub-panel-view" ] [ div [ class "home-menu-item vdiv-1-1 div-1-3 content-centered" ] [ div [ class "content-centered" ] [ text "LOCK" ] ]
                                                      , div [ class "home-menu-item vdiv-1-1 div-1-3 content-centered" ] [ div [ class "content-centered" ] [ text "MENU" ] ]
                                                      , div [ class "home-menu-item vdiv-1-1 div-1-3 content-centered" ] [ div [ class "content-centered" ] [ text "INFORMATION" ] ] ]


---- Monitor Setting View
-- monitor view
monitorSettingScreenView address monitorSettingScreenState = 
  div [ ] [ monitorSettingTopBarView address monitorSettingScreenState
          , monitorSettingBodyView address monitorSettingScreenState ]

-- top bar for monitor setting view
monitorSettingTopBarView address monitorSettingScreenState = 
  div [ class "app-top-bar" ] [ div [ class "float-left" ] [ text ("MONITOR " ++ (toString monitorSettingScreenState.selectedMonitor.number)) ]
                              , div [ class "float-right button", onClick address CloseMonitorConfiguration ] [ text "CLOSE" ] ]

-- main body for monitor setting view
monitorSettingBodyView address monitorSettingScreenState = 
  div [ class "app-body" ]  [ monitorSettingUpperBodyView address monitorSettingScreenState
                            , monitorSettingLowerBodyView address monitorSettingScreenState ]

-- monitor setting upper body view
monitorSettingUpperBodyView address monitorSettingScreenState =
  let monitor = monitorSettingScreenState.selectedMonitor
  in div [ class "monitor-setting-upper-body" ] [ div  [ class "div-1-3" ]  [ signalMatrixView address "VGA 1" monitor.vgaOne monitorSettingScreenState.isCyclePressed monitor
                                                                            , signalMatrixView address "VGA 2" monitor.vgaTwo monitorSettingScreenState.isCyclePressed monitor ]
                                                , div [ class "div-1-3" ]   [ signalMatrixView address "DVI 1" monitor.dviOne monitorSettingScreenState.isCyclePressed monitor
                                                                            , signalMatrixView address "DVI 2" monitor.dviTwo monitorSettingScreenState.isCyclePressed monitor ]
                                                , div [ class "div-1-3" ]   [ signalMatrixView address "VIDEO 1" monitor.videoOne monitorSettingScreenState.isCyclePressed monitor
                                                                            , signalMatrixView address "VIDEO 2" monitor.videoTwo monitorSettingScreenState.isCyclePressed monitor
                                                                            , signalMatrixView address "VIDEO 3" monitor.videoThree monitorSettingScreenState.isCyclePressed monitor]]

-- monitor lower body view
monitorSettingLowerBodyView address monitorSettingScreenState = 
  let cycleButtonClass = if | monitorSettingScreenState.isCycleDisabled -> "disabled"
                          | monitorSettingScreenState.isCyclePressed -> "pressed"
                          | otherwise -> ""
      pipButtonClass = if | monitorSettingScreenState.isPipDisabled -> "disabled"
                        | monitorSettingScreenState.isPipSetPressed -> "pressed"
                        | otherwise -> ""
      osdButtonClass = if | monitorSettingScreenState.isOsdDisabled -> "disabled"
                        | monitorSettingScreenState.isOsdSetPressed -> "pressed" 
                        | otherwise -> ""
  in div [ class "monitor-setting-lower-body" ]  [ div [ class "div-2-3" ]  [ div [ class "div-1-3 align-center" ] [ img [ class "power-button circle button monitor-button ", onClick address CycleButtonPress ] [ ] ]
                                                                            , div [ class "div-1-3 align-center" ] [ img [ class "pip-button circle button monitor-button ", onClick address PipButtonPress ] [ ] ] 
                                                                            , div [ class "div-1-3 align-center" ] [ img [ class "osd-button circle button monitor-button ", onClick address OsdButtonPress ] [ ] ] ]
                                              , pipButtonSetView address monitorSettingScreenState
                                              , osdButtonSetView address monitorSettingScreenState  ]

-- signal matrix view
signalMatrixView address signalType signalName isCyclePressed monitor = 
  let isActivated = if  | isCyclePressed -> case signalType of
                                              "VGA 1" -> monitor.isVgaOneCycle 
                                              "VGA 2" -> monitor.isVgaTwoCycle
                                              "DVI 1" -> monitor.isDviOneCycle
                                              "DVI 2" -> monitor.isDviTwoCycle
                                              "VIDEO 1" -> monitor.isVideoOneCycle
                                              "VIDEO 2" -> monitor.isVideoTwoCycle
                                              "VIDEO 3" -> monitor.isVideoThreeCycle
                        | otherwise -> False

  in div  [ class "signal-matrix-view", onClick address (ActivateCycleSignalMatrixPress signalType) ]  
          [ div [ class "signal-matrix-label" ] 
                [ text signalType ]
          , div [ class "signal-matrix-container" ] 
                [ div [ class "div-7-10" ] 
                      [ input [ type' "text"
                              , disabled isCyclePressed
                              , class (if isActivated then "signal-matrix-container-activated" else "")
                              , value signalName
                              , on "input" targetValue (Signal.message address << (SignalInputChange signalType)) ][ ] ]
                      , div [ class "div-3-10" ] [ text "MATRIX" ] ]] 

-- view for pip buttons set                                            
pipButtonSetView address monitorSettingScreenState = 
  let isVisible = if not monitorSettingScreenState.isPipSetPressed then "hidden" else ""
      monitor = monitorSettingScreenState.selectedMonitor
      getIsPressedSrc value = if value then "images/pip_type_button_pressed.svg" else "images/pip_type_button.svg"
      upDownSrc = getIsPressedSrc monitor.isPipUpDownPressed
      leftRightSrc = getIsPressedSrc monitor.isPipLeftRightPressed
      resizeSrc = getIsPressedSrc monitor.isPipResizePressed
  in div  [ class ("div-1-3 " ++ isVisible) ] 
          [ div [ class "vdiv-1-2" ]  
                [ div [ class "div-1-2 align-center" ]
                      [ div [ class "vdiv-1-5" ]  
                            [ text "LEFT/RIGHT" ] 
                      , div [ class "vdiv-4-5" ]  
                            [ img [ class "vdiv-1-1", src leftRightSrc, onClick address PipLeftRightButtonPress ] [ ] ] ]
                , div [ class "div-1-2 align-center" ]
                      [ div [ class "vdiv-1-5" ]  
                            [ text "UP/DOWN" ] 
                      , div [ class "vdiv-4-5" ]  
                            [ img [ class "vdiv-1-1", src upDownSrc, onClick address PipUpDownButtonPress ] [ ] ] ]
                ]
          , div [ class "vdiv-1-2 align-center" ] 
                [ div [ class "div-1-1 align-center" ]
                      [ div [ class "vdiv-1-5" ]  
                            [ text "RESIZE" ] 
                      , div [ class "vdiv-4-5" ]  
                            [ img [ class "vdiv-1-1", src resizeSrc, onClick address PipResizeButtonPress ] [ ] ] ] ]
          ]

-- view for pip buttons set
osdButtonSetView address monitorSettingScreenState = 
  let isVisible = if not monitorSettingScreenState.isOsdSetPressed then "hidden" else ""
      monitor = monitorSettingScreenState.selectedMonitor
      getIsPressedSrc value = if value then "images/osd_type_button_pressed.svg" else "images/osd_type_button.svg"
      upDownSrc = getIsPressedSrc monitor.isOsdUpDownPressed
      leftRightSrc = getIsPressedSrc monitor.isOsdLeftRightPressed
      selectSrc = getIsPressedSrc monitor.isOsdSelectPressed
  in div  [ class ("div-1-3 " ++ isVisible) ] 
          [ div [ class "vdiv-1-2" ]  
                [div [ class "div-1-2 align-center" ]
                      [ div [ class "vdiv-1-5" ]  
                            [ text "LEFT/RIGHT" ] 
                      , div [ class "vdiv-4-5" ]  
                            [ img [ class "vdiv-1-1", src leftRightSrc, onClick address OsdLeftRightButtonPress ] [ ] ] ]
                , div [ class "div-1-2 align-center" ]
                      [ div [ class "vdiv-1-5" ]  
                            [ text "UP/DOWN" ] 
                      , div [ class "vdiv-4-5" ]  
                            [ img [ class "vdiv-1-1", src upDownSrc, onClick address OsdUpDownButtonPress ] [ ] ] ]
                ]
          , div [ class "vdiv-1-2 align-center" ] 
                [ div [ class "div-1-1 align-center" ]
                      [ div [ class "vdiv-1-5" ]  
                            [ text "SELECT" ] 
                      , div [ class "vdiv-4-5" ]  
                            [ img [ class "vdiv-1-1", src selectSrc, onClick address OsdSelectButtonPress ] [ ] ] ] ]
          ]

---- Preset Setting View
-- preset view
presetSettingScreenView address presetSettingScreenState = 
  div [ ] [ presetSettingTopBarView address presetSettingScreenState
          , presetSettingBodyView address presetSettingScreenState.presets ]

-- top bar for monitor setting view
presetSettingTopBarView address presetSettingScreenState = 
  div [ class "app-top-bar" ] [ div [ class "float-left" ] [ text "PRESETS" ]
                              , div [ class "float-right button", onClick address ClosePresetSettings ] [ text "CLOSE" ] ]

-- main body for monitor setting view
presetSettingBodyView address presets = 
  div [ class "app-body" ]  [ div [ class "vdiv-1-2 div-1-1" ] (List.map (presetContainerView address) presets)
                            , div [ class "vdiv-1-2 div-1-1" ] [ ] ]
-- container for the preset button
presetContainerView address preset = div [ class "vdiv-1-3 div-1-2 align-center preset-button-container" ] [ presetButtonView address preset ]

presetButtonView address preset = 
  div [ class "preset-button button", onClick address (PresetSelected preset), onDoubleClick address (PresetEdit preset) ] 
      [ if not preset.isEditingName then div [ ] [ text (toString  preset.name ) ] else div [ ] 
                                                                                            [ input [ class "preset-button-input"
                                                                                                    , type' "text"
                                                                                                    , value preset.tempName
                                                                                                    , on "input" targetValue (Signal.message address << (PresetNameInput preset))
                                                                                                    , onEnter address (PresetCommitThenSelect preset)
                                                                                                    , onEsc (Signal.message address (PresetEditCancel preset)) ][ ] ]]

-- determine if key code pressed is esc
isEsc : Int -> Result String ()
isEsc code = if code == 27 then Ok () else Err ""

--* PORTS IN *---
port in_longPressedMonitor : Signal String

--* PORTS OUT *--
port out_onPressedMonitor : Signal String
port out_onPressedMonitor = pressedMonitor


port out_onPressReleasedMonitor : Signal String
port out_onPressReleasedMonitor = pressReleasedMonitor
--port out_onReleasedMonitor : Signal SessionId
--port out_onReleasedMonitor = releasedMonitor

pressedMonitor =  let v action =  case action of
                                    MonitorPressedDown _ -> True
                                    _ -> False
                      toMonitorNumber (MonitorPressedDown number) = number
                  in Signal.map toMonitorNumber (Signal.filter v (MonitorPressedDown "") actions.signal)

pressReleasedMonitor =  let v action =  case action of
                                    MonitorPressReleased _ -> True
                                    _ -> False
                            toMonitorNumber (MonitorPressReleased number) = number
                        in Signal.map toMonitorNumber (Signal.filter v (MonitorPressReleased "") actions.signal)

--* WORK AROUNDS *--
-- when enter is pressed on an element message will be sent to the mailbox
onEnter : Address a -> a -> Attribute
onEnter address value =
    on "keydown"
      (Json.customDecoder keyCode is13)
      (\_ -> Signal.message address value)

-- determine if key code pressed is enter
is13 : Int -> Result String ()
is13 code =
  if code == 13 then Ok () else Err "not the right key code"

-- when esc is pressed on an element message will be sent to the mailbox
onEsc : Signal.Message -> Attribute
onEsc message = on "keydown"
                       (Json.customDecoder keyCode isEsc)
                       (always message)