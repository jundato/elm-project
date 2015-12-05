-- author: virgilio dato
-- temporary site : http://ghoulish-scarecrow-6363.herokuapp.com/
module GreenGui.Main where

import Window
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Lazy exposing (lazy, lazy2, lazy3)
import Signal exposing (..)
import List
import Html.Lazy exposing (lazy, lazy2, lazy3)
import Basics
import String
import Debug
import Json.Decode as Json

-- app states model have screeen states that models what state each screen
type alias AppState = { viewState : Int
                      , homeScreenState : HomeScreenState
                      , monitorSettingScreenState : MonitorSettingScreenState
                      , presetSettingScreenState : PresetSettingScreenState
                      , menuOptionsScreenState : MenuOptionsScreenState
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

-- menu options
type alias MenuOptionsScreenState = { viewState : Int
                                    ,  matrixSetupScreenState : MatrixSetupScreenState
                                    }

type alias MatrixSetupScreenState = { viewState : Int
                                    , extronSignalMatrixInputs : List SignalMatrixInput
                                    , ntiSignalMatrixInputs : List SignalMatrixInput
                                    , atlonaSignalMatrixInputs : List SignalMatrixInput  }
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

type alias SignalMatrixInput =  { name : String
                                , type' : SignalMatrixInputType}

type SignalMatrixInputType = DVI | VGA  | CVBS

------ DEFAULT MODELS
-- model for the whole app
-- 1) home screen
-- 2) monitor setting screen
-- 3) preset setting screen
-- 4) menu options screen
defaultAppState : AppState 
defaultAppState = { viewState = 1
                  , homeScreenState = defaultHomeScreenState
                  , monitorSettingScreenState = defaultMonitorSettingScreenState
                  , presetSettingScreenState = defaulPresetSettingScreenState
                  , menuOptionsScreenState = defaultMenuOptionsScreenState } 

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

-- model for menu options screen state
-- 1 - home menu options
-- 2 - matrix setup
-- 3 - wifi
-- 4 - version
defaultMenuOptionsScreenState : MenuOptionsScreenState
defaultMenuOptionsScreenState = { viewState = 1
                                , matrixSetupScreenState = defaultMatrixSetupScreenState }

defaultMatrixSetupScreenState : MatrixSetupScreenState
defaultMatrixSetupScreenState = { viewState = 1
                                , extronSignalMatrixInputs = defaultExtronSignalMatrixInputs
                                , ntiSignalMatrixInputs = defaultNtiSignalMatrixInputs
                                , atlonaSignalMatrixInputs = defaultAtlonaSignalMatrixInputs
                                }

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

-- default signal matrix inputs
defaultSignalMatrixInputs : List SignalMatrixInput
defaultSignalMatrixInputs = [ ]

defaultExtronSignalMatrixInputs : List SignalMatrixInput
defaultExtronSignalMatrixInputs = [ createSignalMatrixInput "X-BAND RADAR" VGA
                                  , createSignalMatrixInput "S-BAND RADAR" VGA
                                  , createSignalMatrixInput "WEATHER" DVI
                                  , createSignalMatrixInput "S-BAND RADAR" DVI
                                  , createSignalMatrixInput "ENGINE CAM" CVBS
                                  , createSignalMatrixInput "DECK CAM" CVBS
                                  , createSignalMatrixInput "X-BAND RADAR" CVBS ]

defaultNtiSignalMatrixInputs : List SignalMatrixInput
defaultNtiSignalMatrixInputs = [ createSignalMatrixInput "X-BAND RADAR" VGA
                                  , createSignalMatrixInput "S-BAND RADAR" VGA
                                  , createSignalMatrixInput "WEATHER" DVI
                                  , createSignalMatrixInput "S-BAND RADAR" DVI
                                  , createSignalMatrixInput "ENGINE CAM" CVBS
                                  , createSignalMatrixInput "DECK CAM" CVBS
                                  , createSignalMatrixInput "X-BAND RADAR" CVBS ]

defaultAtlonaSignalMatrixInputs : List SignalMatrixInput
defaultAtlonaSignalMatrixInputs = [ createSignalMatrixInput "X-BAND RADAR" VGA
                                  , createSignalMatrixInput "S-BAND RADAR" VGA
                                  , createSignalMatrixInput "WEATHER" DVI
                                  , createSignalMatrixInput "S-BAND RADAR" DVI
                                  , createSignalMatrixInput "ENGINE CAM" CVBS
                                  , createSignalMatrixInput "DECK CAM" CVBS
                                  , createSignalMatrixInput "X-BAND RADAR" CVBS ]

createSignalMatrixInput : String -> SignalMatrixInputType -> SignalMatrixInput
createSignalMatrixInput name type' = 
  { name = name
  , type' = type' 
  }

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
  | MenuOptionPress
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
-- menu setting actions
  | MatrixSetupPress
  | ExtronSetupPress
  | NtiSetupPress
  | AtlonaSetupPress
  | BackToMenuPress
  | CloseSetupPress

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
      in { appState | homeScreenState = { homeScreenState' | monitors = monitors'
                                                            , isPowerDisabled = powerMustBeDisabled } }
    SelectAllMonitors ->
      let homeScreenState' = appState.homeScreenState
      in { appState | homeScreenState = { homeScreenState' | monitors = setAllMonitorAsSelected homeScreenState'.monitors
                                                            , isPowerDisabled = False } }
    SelectMonitorToConfigure monitor' ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
          homeScreenState' = appState.homeScreenState
      in { appState | viewState = 2
                    , homeScreenState = { homeScreenState' | monitors = setMonitorAsSelected monitor' homeScreenState'.monitors }
                    , monitorSettingScreenState = { monitorSettingScreenState' | selectedMonitor = monitor'
                                                                                , isPipSetPressed = False
                                                                                , isOsdSetPressed = False } }
    MonitorPressedDown number -> appState
    MonitorPressReleased number -> appState
    LongPressedMonitor number -> 
      let monitorSettingScreenState' = appState.monitorSettingScreenState
          homeScreenState' = appState.homeScreenState
          foundMonitor = findMonitor number homeScreenState'.monitors
      in { appState | viewState = 2
                    , homeScreenState = { homeScreenState' | monitors = setMonitorAsSelected foundMonitor homeScreenState'.monitors }
                    , monitorSettingScreenState = { monitorSettingScreenState' | selectedMonitor = foundMonitor
                                                                                , isPipSetPressed = False
                                                                                , isOsdSetPressed = False } }
 
    PowerPress ->
      let homeScreenState' = appState.homeScreenState
      in { appState | homeScreenState = { homeScreenState' | monitors = setSelectedMonitorsToPowerPress homeScreenState'.monitors } }
    PresetPress ->
      { appState | viewState = 3 }
    MenuOptionPress ->
      { appState | viewState = 4 }
-- Moves monitor page to the next page
    PreviousMonitorPage ->
      let monitorsPerPage = 5
          homeScreenState' = appState.homeScreenState
          maxFlips = ceiling ((toFloat (List.length homeScreenState'.monitors)) / monitorsPerPage)
      in { appState | homeScreenState = flipMonitorPage -1 maxFlips monitorsPerPage homeScreenState' }
    NextMonitorPage ->
      let monitorsPerPage = 5
          homeScreenState' = appState.homeScreenState
          maxFlips = ceiling ((toFloat (List.length homeScreenState'.monitors)) / monitorsPerPage)
      in { appState | homeScreenState = flipMonitorPage 1 maxFlips monitorsPerPage homeScreenState' }
---- Monitor Setting Actions
    CloseMonitorConfiguration ->
      let homeScreenState' = appState.homeScreenState
          monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | viewState = 1
                    , homeScreenState = { homeScreenState' | monitors = updateMonitorList monitorSettingScreenState'.selectedMonitor homeScreenState'.monitors } }
    SignalInputChange signalType value ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
          monitor' = monitorSettingScreenState'.selectedMonitor
      in { appState | monitorSettingScreenState = { monitorSettingScreenState' | selectedMonitor = setSignalInputChange signalType value monitor' } }
    CycleButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in  if not monitorSettingScreenState'.isCycleDisabled then { appState | monitorSettingScreenState = setCycleButtonPress monitorSettingScreenState' }
          else appState
    PipButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in  if not monitorSettingScreenState'.isPipDisabled then { appState | monitorSettingScreenState = setPipButtonPress monitorSettingScreenState' }
          else appState
    OsdButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in  if not monitorSettingScreenState'.isOsdDisabled then { appState | monitorSettingScreenState = setOsdButtonPress monitorSettingScreenState' }
          else appState
    ActivateCycleSignalMatrixPress signalType ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in  if monitorSettingScreenState'.isCyclePressed then { appState | monitorSettingScreenState = { monitorSettingScreenState' | selectedMonitor = activateCycleSignalMatrix signalType monitorSettingScreenState'.selectedMonitor } }
          else appState
    PipUpDownButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | monitorSettingScreenState = setPipUpDownButtonPress monitorSettingScreenState' }
    PipLeftRightButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | monitorSettingScreenState = setPipLeftRightButtonPress monitorSettingScreenState' }
    PipResizeButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | monitorSettingScreenState = setPipResizeButtonPress monitorSettingScreenState' }
    OsdUpDownButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | monitorSettingScreenState = setOsdUpDownButtonPress monitorSettingScreenState' }
    OsdLeftRightButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | monitorSettingScreenState = setOsdLeftRightButtonPress monitorSettingScreenState' }
    OsdSelectButtonPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | monitorSettingScreenState = setOsdSelectButtonPress monitorSettingScreenState' }
---- Preset setting action
    ClosePresetSettings ->
      { appState | viewState = 1 }
    PresetSelected preset ->
      let homeScreenState' = appState.homeScreenState
      in { appState | homeScreenState = { homeScreenState' | monitors = preset.monitors } }
    PresetEdit preset ->
      let presetSettingScreenState' = appState.presetSettingScreenState
      in { appState | presetSettingScreenState = { presetSettingScreenState' | presets = setPresetToEdit preset presetSettingScreenState'.presets } }
    PresetCommitThenSelect preset ->
      let presetSettingScreenState' = appState.presetSettingScreenState
          monitors = appState.homeScreenState.monitors
      in { appState | presetSettingScreenState = { presetSettingScreenState' | presets = setPresetCommitThenSelect preset monitors presetSettingScreenState'.presets } }
    PresetNameInput preset value ->
      let presetSettingScreenState' = appState.presetSettingScreenState
      in { appState | presetSettingScreenState = { presetSettingScreenState' | presets = setPresetName preset value presetSettingScreenState'.presets } }
    PresetEditCancel preset ->
      let presetSettingScreenState' = appState.presetSettingScreenState
      in { appState | presetSettingScreenState = { presetSettingScreenState' | presets = cancelPresetEdit preset presetSettingScreenState'.presets}}
---- Menu Option action
    MatrixSetupPress ->
      let menuOptionsScreenState' = appState.menuOptionsScreenState
      in { appState | menuOptionsScreenState = { menuOptionsScreenState' | viewState = 2 } }
    ExtronSetupPress ->
      let menuOptionsScreenState' = appState.menuOptionsScreenState
          matrixSetupScreenState' = menuOptionsScreenState'.matrixSetupScreenState
      in { appState | menuOptionsScreenState = { menuOptionsScreenState' | matrixSetupScreenState = { matrixSetupScreenState' | viewState = 1
                                                                                                                              } } }
    NtiSetupPress ->
      let menuOptionsScreenState' = appState.menuOptionsScreenState
          matrixSetupScreenState' = menuOptionsScreenState'.matrixSetupScreenState
      in { appState | menuOptionsScreenState = { menuOptionsScreenState' | matrixSetupScreenState = { matrixSetupScreenState' | viewState = 1 } } }
    AtlonaSetupPress ->
      let menuOptionsScreenState' = appState.menuOptionsScreenState
          matrixSetupScreenState' = menuOptionsScreenState'.matrixSetupScreenState
      in { appState | menuOptionsScreenState = { menuOptionsScreenState' | matrixSetupScreenState = { matrixSetupScreenState' | viewState = 1 } } }
    CloseSetupPress -> 
      { appState | viewState = 1 }
    BackToMenuPress ->
      let menuOptionsScreenState' = appState.menuOptionsScreenState
      in { appState | menuOptionsScreenState = { menuOptionsScreenState' | viewState = 1 } }
------ CONVERSION FUNCTIONS
---- HOME SCREEN VIEW FUNCTIONS
-- sets the monitor to selected and returns the new list
setMonitorAsSelected : Monitor -> List Monitor -> List Monitor
setMonitorAsSelected monitor monitors = 
  List.map (\m -> if m.number == monitor.number then { monitor | isSelected = not True }
                  else { m | isSelected = False } ) monitors

-- negates the value of wether the monitor selected or not
toggleMonitorAsSelected : Monitor -> List Monitor -> List Monitor
toggleMonitorAsSelected monitor monitors = 
  List.map (\m -> if m.number == monitor.number then { monitor | isSelected = not monitor.isSelected }
                  else m ) monitors

-- sets all monitors to selected
setAllMonitorAsSelected : List Monitor -> List Monitor
setAllMonitorAsSelected  monitors = 
  List.map (\m -> { m | isSelected = True } ) monitors

-- moves monitor pages left and right : negative for left, positive for right
flipMonitorPage : Int -> Int -> Int -> HomeScreenState -> HomeScreenState
flipMonitorPage flips maxFlips monitorsPerPage homeScreenState =
  let monitors' = homeScreenState.monitors
      newPageIndex = clamp 0 (maxFlips - 1) (homeScreenState.monitorPageIndex + flips)
      
  in 
    { homeScreenState | monitorPageIndex = newPageIndex 
                      , monitors = (List.indexedMap (setVisibilityByPageIndex newPageIndex monitorsPerPage) monitors') }

-- sets a monitor as selected
setSelectedMonitorsToPowerPress : List Monitor -> List Monitor
setSelectedMonitorsToPowerPress monitors =
  List.map (\m -> if m.isSelected then { m | isOn = not m.isOn }
                  else  m ) monitors

-- finds and returns a monitor if not returns a default
findMonitor : String -> List Monitor -> Monitor
findMonitor number monitors = 
  case List.take 1 (List.filter (\m -> m.number == number) monitors) of
    [monitor] -> monitor
    _ -> defaultMonitor "-1" False

-- set visibility of page by index
setVisibilityByPageIndex : Int -> Int -> Int -> Monitor -> Monitor
setVisibilityByPageIndex newPageIndex monitorsPerPage index monitor = 
  let isVisible' =  if index // monitorsPerPage == newPageIndex then True
                    else False
  in { monitor | isVisible = isVisible' }

---- MONITOR SETTING FUNCTION
-- updates monitor on list
updateMonitorList : Monitor -> List Monitor -> List Monitor
updateMonitorList monitor monitors =
  List.map (\m -> if m.number ==  monitor.number then { monitor | isSelected = True }  else m ) monitors

-- set signal input depending on control
-- VGA 1, VGA 2, DVI 1, DVI 2, VIDEO 1, VIDEO 2, VIDEO 3
setSignalInputChange : String -> String -> Monitor -> Monitor
setSignalInputChange signalType value monitor =
  let newMonitor = case signalType of
                      "VGA 1" -> { monitor | vgaOne = value } 
                      "VGA 2" -> { monitor | vgaTwo = value }  
                      "DVI 1" -> { monitor | dviOne = value }  
                      "DVI 2" -> { monitor | dviTwo = value } 
                      "VIDEO 1" -> { monitor | videoOne = value } 
                      "VIDEO 2" -> { monitor | videoTwo = value } 
                      "VIDEO 3" -> { monitor | videoThree = value } 
                      _ -> monitor
  in newMonitor

-- toggle cycle button
setCycleButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setCycleButtonPress monitorSettingScreenState =
  { monitorSettingScreenState | isCyclePressed = not monitorSettingScreenState.isCyclePressed
                              , isPipDisabled = if not monitorSettingScreenState.isCyclePressed then True else False
                              , isOsdDisabled = if not monitorSettingScreenState.isCyclePressed then True else False
                              }
-- toggles pip button and sets the rest to false
setPipButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setPipButtonPress monitorSettingScreenState =
  { monitorSettingScreenState | isPipSetPressed = not monitorSettingScreenState.isPipSetPressed
                              , isOsdSetPressed = False
                              , isCycleDisabled = if not monitorSettingScreenState.isPipSetPressed then True else False
                              }

-- toggles osd button and sets the rest to false
setOsdButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setOsdButtonPress monitorSettingScreenState =
  { monitorSettingScreenState | isPipSetPressed = False
                              , isOsdSetPressed = not monitorSettingScreenState.isOsdSetPressed
                              , isCycleDisabled = if not monitorSettingScreenState.isOsdSetPressed then True else False
                              }

-- toggle signal matrix button
activateCycleSignalMatrix : String -> Monitor -> Monitor
activateCycleSignalMatrix signalType monitor =
  let newMonitor = case signalType of
                      "VGA 1" -> { monitor | isVgaOneCycle = not monitor.isVgaOneCycle } 
                      "VGA 2" -> { monitor | isVgaTwoCycle = not monitor.isVgaTwoCycle }  
                      "DVI 1" -> { monitor | isDviOneCycle = not monitor.isDviOneCycle }  
                      "DVI 2" -> { monitor | isDviTwoCycle = not monitor.isDviTwoCycle } 
                      "VIDEO 1" -> { monitor | isVideoOneCycle = not monitor.isVideoOneCycle } 
                      "VIDEO 2" -> { monitor | isVideoTwoCycle = not monitor.isVideoTwoCycle } 
                      "VIDEO 3" -> { monitor | isVideoThreeCycle = not monitor.isVideoThreeCycle } 
                      _ -> monitor
  in newMonitor

-- toggles pip butons
setPipUpDownButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setPipUpDownButtonPress monitorSettingScreenState =
  let monitor = monitorSettingScreenState.selectedMonitor 
  in { monitorSettingScreenState | selectedMonitor = { monitor |  isPipUpDownPressed = not monitor.isPipUpDownPressed }}
setPipLeftRightButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setPipLeftRightButtonPress monitorSettingScreenState = 
  let monitor = monitorSettingScreenState.selectedMonitor 
  in { monitorSettingScreenState | selectedMonitor = { monitor |  isPipLeftRightPressed = not monitor.isPipLeftRightPressed }}
setPipResizeButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setPipResizeButtonPress monitorSettingScreenState = 
  let monitor = monitorSettingScreenState.selectedMonitor 
  in { monitorSettingScreenState | selectedMonitor = { monitor |  isPipResizePressed = not monitor.isPipResizePressed }}

-- toggle osd buttons
setOsdUpDownButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setOsdUpDownButtonPress monitorSettingScreenState = 
  let monitor = monitorSettingScreenState.selectedMonitor 
  in { monitorSettingScreenState | selectedMonitor = { monitor |  isOsdUpDownPressed = not monitor.isOsdUpDownPressed }}
setOsdLeftRightButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setOsdLeftRightButtonPress monitorSettingScreenState = 
  let monitor = monitorSettingScreenState.selectedMonitor 
  in { monitorSettingScreenState | selectedMonitor = { monitor |  isOsdLeftRightPressed = not monitor.isOsdLeftRightPressed }}
setOsdSelectButtonPress : MonitorSettingScreenState -> MonitorSettingScreenState
setOsdSelectButtonPress monitorSettingScreenState = 
  let monitor = monitorSettingScreenState.selectedMonitor 
  in { monitorSettingScreenState | selectedMonitor = { monitor |  isOsdSelectPressed = not monitor.isOsdSelectPressed }}

--List.map (\m -> if m.number ==  monitor.number then monitor else m ) monitors
---- PRESET SETTING FUNCTIONS
setPresetToEdit : Preset -> List Preset -> List Preset
setPresetToEdit preset presets =
  List.map (\p -> if  p.id == preset.id then { p  | isEditingName = not p.isEditingName
                                                  , tempName = p.name } 
                  else { p  | isEditingName = False
                            , tempName = "" } ) presets

setPresetCommitThenSelect : Preset -> List Monitor -> List Preset -> List Preset
setPresetCommitThenSelect preset monitors presets =
  List.map (\p -> if  p.id == preset.id then { p  | name = p.tempName
                                                  , isEditingName = False
                                                  , monitors = monitors } 
                  else p ) presets

cancelPresetEdit : Preset -> List Preset -> List Preset
cancelPresetEdit preset presets =
  List.map (\p -> if  p.id == preset.id then { p | isEditingName = False }
                  else p ) presets


setPresetName : Preset -> String -> List Preset -> List Preset
setPresetName preset value presets =
  List.map (\p -> if  p.id == preset.id then { p | tempName = value } 
                  else p ) presets
--- entry point
main : Signal Html
main =
  Signal.map (appView actions.address) appState

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
appView :Address Action -> AppState -> Html
appView address appState =
  let homeScreenState = appState.homeScreenState
      monitorSettingScreenState = appState.monitorSettingScreenState
      presetSettingScreenState = appState.presetSettingScreenState
      menuOptionsScreenState = appState.menuOptionsScreenState
      viewToDisplay = case appState.viewState of
                        1 -> homeScreenView address homeScreenState
                        2 -> monitorSettingScreenView address monitorSettingScreenState
                        3 -> presetSettingScreenView address presetSettingScreenState
                        4 -> menuOptionsView address menuOptionsScreenState 
                        _ -> div [] [ text "nothing to display" ]
  in viewToDisplay
---- Main View
-- home screen view
homeScreenView address homeScreenState =
  div [ class "main" ]  
      [ monitorPanelView address homeScreenState.monitors
      , homePanelView address homeScreenState
      , homeMenuView address
      ] 
-- monitor panel view contains buttons container and pager
monitorPanelView address monitors =  
  div [ class "monitor-panel-view" ]  [ monitorViewPager address
                                      , div [ class "monitor-views" ] ( monitorViewButtons address monitors ) ]

-- list of monitor buttons
monitorViewButtons address monitors = 
  (List.map (monitorViewButton address) monitors)

--- view of a monitor button
monitorViewButton address monitor = 
  let isOn =  if monitor.isOn then ""
                    else "_off"
      isHighlighted = if monitor.isSelected then "selected"
                      else ""
  in
    div [ class "div-1-5 monitor-view-container " ]
    [ div [ class (isHighlighted ++ " " ++ "monitor-view content-centered" )
          , onClick address (SelectMonitor monitor)
          , onDoubleClick address (SelectMonitorToConfigure monitor)
          , onMouseDown address (MonitorPressedDown monitor.number)
          , onMouseUp address (MonitorPressReleased monitor.number) ]  
          [ div [ class "div-4-5 vdiv-4-5 button" ] 
                [ div [ class "vdiv-1-5 align-center" ] 
                      [ label [ class "monitor-button-label" ] [ text monitor.number ] ]
                , div [ class "vdiv-4-5 content-centered" ] 
                      [ img [ class "div-4-5 vdiv-4-5", src ("images/monitor_icon" ++ isOn ++ ".svg") ] [ ] ] ] ]
    ]

--- view of a monitor view pager, it is located at the upper portion of the screen
monitorViewPager address = 
  div [ class "monitor-pager-view" ]
      [ div [ class "div-1-10 vdiv-1-1" ] [ ]
      , div [ class "div-4-5" ] 
            [ div [ class "monitor-selectall-view div-1-1" ]  
                  [ div [ class "monitor-selectall-container content-centered"] 
                        [ div [ class "monitor-selectall-button button", onClick address SelectAllMonitors] 
                              [ div [ class "content-centered" ] [ text "SELECT ALL" ] 
                              ] 
                        ] 
                  ]
            ]
      , div [ class "div-1-10 vdiv-1-1" ] [ ]
      ]

--- view of the home panel, the home panel is located on the center of the screen
homePanelView address homeScreenState = 
  let powerButtonState = if homeScreenState.isPowerDisabled then "_disabled" else ""
  in div  [ class "home-panel-view" ] 
          [ div [ class "home-panel-division div-1-4 vdiv-1-1" ] 
                [ div [ class ("home-panel-button button content-centered power " ++ powerButtonState), onClick address PowerPress ] 
                      [ img  [src ("images/power_icon" ++ powerButtonState ++ ".svg") ] [ ] ] ] 
          , div [ class "home-panel-division div-1-4 content-centered" ] [ div [ class "div-4-5" ]
                                                              [ div [ class "div-2-5" ] [ img [ class "icon", src "images/decrement_icon.svg" ] [] ]
                                                              , div [ class "div-1-5" ] [ div [ class "brightness-icon-container" ] 
                                                                                              [ img [ class "icon", src "images/brightness_icon.svg" ] [] ]
                                                                                              ]
                                                              , div [ class "div-2-5" ] [ img [ class "icon", src "images/increment_icon.svg" ] [] ] ] ]
          , div [ class "home-panel-division div-1-4 vdiv-1-1" ] 
                [ div [ class "home-panel-button button content-centered night-mode" ] 
                      [ img [ src "images/night-mode_icon.svg" ] [ ] ] ]
          , div [ class "home-panel-division div-1-4 vdiv-1-1" ] 
                [ div [ class "home-panel-button button content-centered presets", onClick address PresetPress ] 
                      [ img [src "images/preset_icon.svg" ] [ ] ] ] ]

--- view of menus of the home panel, it is located at the bottom of the screen
homeMenuView address = 
  div [ class "sub-panel-view" ] 
      [ div [ class "home-menu-item vdiv-1-1 div-1-3 content-centered" ] 
            [ div [ class "content-centered" ] [ img [class "icon", src "images/lock_icon.svg" ] [ ] ] ]
      , div [ class "home-menu-item vdiv-1-1 div-1-3 content-centered", onClick address MenuOptionPress ] 
            [ div [ class "content-centered" ] [ img [class "icon", src "images/menu_icon.svg" ] [ ] ] ]
      , div [ class "home-menu-item vdiv-1-1 div-1-3 content-centered" ] 
            [ div [ class "content-centered" ] [ img [ class "icon", src "images/information_icon.svg" ] [ ]  ] ] ]

---- Monitor Setting View
-- monitor view
monitorSettingScreenView address monitorSettingScreenState = 
  div [ class "main" ] 
      [ monitorSettingTopBarView address monitorSettingScreenState
      , monitorSettingBodyView address monitorSettingScreenState ]

-- top bar for monitor setting view
monitorSettingTopBarView address monitorSettingScreenState = 
  div [ class "app-top-bar" ] [ div [ class "float-left vdiv-1-1 content-centered" ] [ text ("MONITOR " ++ (toString monitorSettingScreenState.selectedMonitor.number)) ]
                              , div [ class "float-right menu-button", onClick address CloseMonitorConfiguration ] [ closeIcon ] ]

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
  let cycleButtonClass =  if monitorSettingScreenState.isCycleDisabled then "disabled"
                          else if monitorSettingScreenState.isCyclePressed then "pressed"
                          else ""
      pipButtonClass =  if monitorSettingScreenState.isPipDisabled then "disabled"
                        else if monitorSettingScreenState.isPipSetPressed then "pressed"
                        else ""
      osdButtonClass =  if monitorSettingScreenState.isOsdDisabled then "disabled"
                        else if monitorSettingScreenState.isOsdSetPressed then "pressed" 
                        else ""
  in div  [ class "monitor-setting-lower-body" ]  
          [ div [ class "div-2-3" ]  
                [ div [ class "div-1-3 content-centered" ] 
                      [ div [ class ("cycle-button circle button monitor-button content-centered " ++ cycleButtonClass)
                            , onClick address CycleButtonPress ] 
                            [ text "CYCLE" ] ]
                , div [ class "div-1-3 content-centered" ] 
                      [ div [ class ("pip-button circle button monitor-button content-centered " ++ pipButtonClass)
                            , onClick address PipButtonPress ] 
                            [ text "PIP" ] ] 
                , div [ class "div-1-3 content-centered" ] 
                      [ div [ class ("osd-button circle button monitor-button content-centered " ++ osdButtonClass)
                            , onClick address OsdButtonPress ] 
                            [ text "OSD" ] ] ]
          , pipButtonSetView address monitorSettingScreenState
          , osdButtonSetView address monitorSettingScreenState  ]

-- signal matrix view
signalMatrixView address signalType signalName isCyclePressed monitor = 
  let isActivated = if isCyclePressed then case signalType of
                                              "VGA 1" -> monitor.isVgaOneCycle 
                                              "VGA 2" -> monitor.isVgaTwoCycle
                                              "DVI 1" -> monitor.isDviOneCycle
                                              "DVI 2" -> monitor.isDviTwoCycle
                                              "VIDEO 1" -> monitor.isVideoOneCycle
                                              "VIDEO 2" -> monitor.isVideoTwoCycle
                                              "VIDEO 3" -> monitor.isVideoThreeCycle
                                              _ -> False
                    else False
  in div  [ class "signal-matrix-view", onClick address (ActivateCycleSignalMatrixPress signalType) ]  
          [ div [ class "signal-matrix-label" ] 
                [ text signalType ]
          , div [ class "signal-matrix-container" ] 
                [ div [ class "div-7-10" ] 
                      [ input [ type' "text"
                              , disabled isCyclePressed
                              , class ("signal-matrix-input" ++ (if isActivated then " signal-matrix-container-activated" else ""))
                              , value signalName
                              , on "input" targetValue (Signal.message address << (SignalInputChange signalType)) ][ ] ]
                      , div [ class "div-3-10 content-centered signal-matrix-side" ] [ text "MATRIX" ] ]
          , div [ class "clear-both" ] [ ] ] 

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
  div [ class "app-top-bar" ] [ div [ class "float-left  vdiv-1-1 content-centered" ] [ text "PRESETS" ]
                              , div [ class "float-right menu-button", onClick address ClosePresetSettings ] [ closeIcon ] ]

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
---- Menu Options View
-- menu option view
menuOptionsView address screenState =
  let view =  case screenState.viewState of
                1 ->  [ menuOptionsTopBarView address screenState 
                      , menuOptionsBodyView address screenState ]
                2 ->  [ matrixSetupTopBarView address screenState
                      , matrixSetupBodyView address screenState ]                     
                _ ->  [ ]
  in div [ class "main" ] view

-- top bar for menu option view
menuOptionsTopBarView address screenState = 
  div [ class "app-top-bar" ] [ div [ class "float-left vdiv-1-1 content-centered" ] [ text "MENU" ]
                              , div [ class "float-right menu-button", onClick address CloseSetupPress ] [ closeIcon ] ]


-- main body for monitor setting view
menuOptionsBodyView address screenState = 

  div [ class "app-body" ]  [ div [ ] [ div [ class "div-1-5 vdiv-1-1" ] [ ]
                                      , div [ class "div-3-5 vdiv-1-1" ] 
                                            [ div [ class "vdiv-4-5 div-1-1" ] 
                                                  [ div [ class "div-1-3 vdiv-1-1 content-centered" ] 
                                                        [ div [ class "vdiv-1-3 div-2-3 button menu content-centered"
                                                              , onClick address MatrixSetupPress ] [ text "MATRIX SETUP" ] ]
                                                  , div [ class "div-1-3 vdiv-1-1 content-centered" ] 
                                                        [ div [ class "vdiv-1-3 div-2-3 button menu content-centered" ] [ text "WIFI SETUP" ] ]
                                                  , div [ class "div-1-3 vdiv-1-1 content-centered" ]
                                                        [ div [ class "vdiv-1-3 div-2-3 button menu content-centered" ] [ text "UPDATES" ] ] ]
                                            ] 
                                      , div [ class "div-1-5 vdiv-1-1" ] [ ] ] ] 

matrixSetupTopBarView address screenState = 
  div [ class "app-top-bar" ] [ div [ class "float-left vdiv-1-1 content-centered" ] [ text "MENU" ]
                              , div [ class "float-right menu-button", onClick address CloseSetupPress ] [ closeIcon ]
                              , div [ class "float-right menu-button", onClick address BackToMenuPress ] [ backIcon ] ]

matrixSetupBodyView address screenState =
  let signalTypes = List.map (\t -> case t of
                                      VGA -> "VGA"
                                      DVI -> "DVI"
                                      CVBS -> "DVBS" ) [VGA, DVI, CVBS]
      matrixSetupScreenState = screenState.matrixSetupScreenState
      matrixInputSignals =  case matrixSetupScreenState.viewState of
                              1 -> matrixSetupScreenState.extronSignalMatrixInputs
                              2 -> matrixSetupScreenState.ntiSignalMatrixInputs
                              3 -> matrixSetupScreenState.atlonaSignalMatrixInputs
                              _ -> [ ]
  in  div [ class "app-body" ]  [ div [ ] [ div [ class "div-1-5 vdiv-1-1" ] [ ]
                                          , div [ class "div-3-5 vdiv-1-1" ] 
                                                [ div [ class "vdiv-4-5 div-1-1" ] 
                                                      (List.map (signalMatrixInputSetup signalTypes) matrixInputSignals)
                                                ] 
                                          , div [ class "div-1-5 vdiv-1-1" ] [ ] ] ] 

signalMatrixInputSetup signalTypes signalMatrixInput = 
  let x = 1
  in  div [ class "signal-matrix-container vdiv-1-10" ] 
          [ div [ class "div-7-10" ] 
                [ input [ type' "text"
                        , class "signal-matrix-input"
                        , value signalMatrixInput.name ] [ ] ]
          , div [ class "div-3-10 signal-matrix-side" ] [ select [ ] (List.map (\t -> option [ value t ] [ text t ] ) signalTypes) ] ] 

-- reuseable views
closeIcon : Html
closeIcon = img [ class "icon", src "images/close_icon.svg" ][ ]

backIcon : Html
backIcon = img [ class "icon", src "images/back_icon.svg" ][ ]

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

pressedMonitor =
  let needsMonitorPressedDown action =
        case action of
          MonitorPressedDown number -> True
          _ -> False
      toSelector action =
        case action of
          MonitorPressedDown number -> number
          _ -> ""
  in  actions.signal
        |> Signal.filter needsMonitorPressedDown (MonitorPressedDown "")
        |> Signal.map toSelector

pressReleasedMonitor =  
  let needsMonitorPressReleased action =
        case action of
          MonitorPressReleased number -> True
          _ -> False
      toSelector action =
        case action of
          MonitorPressReleased number -> number
          _ -> ""
  in  actions.signal
        |> Signal.filter needsMonitorPressReleased (MonitorPressReleased "")
        |> Signal.map toSelector

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