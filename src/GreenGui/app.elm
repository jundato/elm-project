-- author: virgilio dato
-- temporary site : http://ghoulish-scarecrow-6363.herokuapp.com/
module GreenGui.App where

import GreenGui.Types exposing (..)
import GreenGui.Home as Home

-- elm packages
import Signal exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Lazy exposing (lazy, lazy2, lazy3)
import Json.Decode as Json

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
  | HomeView Home.Action
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
    HomeView  act ->
      { appState | homeScreenState = Home.update act appState.homeScreenState }
---- Monitor Setting Actions
    CloseMonitorConfiguration ->
      let homeScreenState' = appState.homeScreenState
          monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | currentScreenState = 1
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
      { appState | currentScreenState = 1 }
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

-- actions from user input
actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp

------ VIEWS
---- Main View
-- app view handles which screen state view is being displayed
view :Address Action -> AppState -> Html
view address appState =
  let homeScreenState = appState.homeScreenState
      monitorSettingScreenState = appState.monitorSettingScreenState
      presetSettingScreenState = appState.presetSettingScreenState
      viewToDisplay = case appState.currentScreenState of
                        1 -> Home.view address homeScreenState
                        2 -> monitorSettingScreenView address monitorSettingScreenState
                        3 -> presetSettingScreenView address presetSettingScreenState
                        _ -> div [] [ text "nothing to display" ]
  in viewToDisplay

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
  let cycleButtonClass =  if monitorSettingScreenState.isCycleDisabled then "disabled"
                          else if monitorSettingScreenState.isCyclePressed then "pressed"
                          else ""
      pipButtonClass =  if monitorSettingScreenState.isPipDisabled then "disabled"
                        else if monitorSettingScreenState.isPipSetPressed then "pressed"
                        else ""
      osdButtonClass =  if monitorSettingScreenState.isOsdDisabled then "disabled"
                        else if monitorSettingScreenState.isOsdSetPressed then "pressed" 
                        else ""
  in div [ class "monitor-setting-lower-body" ]  [ div [ class "div-2-3" ]  [ div [ class "div-1-3 align-center" ] [ img [ class "power-button circle button monitor-button ", onClick address CycleButtonPress ] [ ] ]
                                                                            , div [ class "div-1-3 align-center" ] [ img [ class "pip-button circle button monitor-button ", onClick address PipButtonPress ] [ ] ] 
                                                                            , div [ class "div-1-3 align-center" ] [ img [ class "osd-button circle button monitor-button ", onClick address OsdButtonPress ] [ ] ] ]
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