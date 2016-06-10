module MonitorSetup exposing (..)

import Types exposing (..)
import Icons exposing (..)
import General exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

-- MODEL
type alias Model =  { selectedMonitor : Monitor
                    , isVgaOneSelectOpen : Bool
                    , isVgaTwoSelectOpen : Bool
                    , isDviOneSelectOpen : Bool
                    , isDviTwoSelectOpen : Bool
                    , isVideoOneSelectOpen : Bool
                    , isVideoTwoSelectOpen : Bool
                    , isVideoThreeSelectOpen : Bool
                    , isOsdSetPressed : Bool
                    , isPipSetPressed : Bool
                    , segmentState : MonitorSegmentState
                    , selectedTheme : Theme
}

type MonitorSegmentState = None | Pip | Osd

defaultModel : Model
defaultModel =  { selectedMonitor = defaultMonitor "1" True
                , isVgaOneSelectOpen = False
                , isVgaTwoSelectOpen = False
                , isDviOneSelectOpen = False
                , isDviTwoSelectOpen = False
                , isVideoOneSelectOpen = False
                , isVideoTwoSelectOpen = False
                , isVideoThreeSelectOpen = False
                , isOsdSetPressed = False
                , isPipSetPressed = False
                , segmentState = None
                , selectedTheme = DefaultTheme }

type Msg
  = SignalInputToggle String
  | CloseMonitorConfiguration
  | PipButtonPress
  | OsdButtonPress
  | PipUpDownButtonPress
  | PipLeftRightButtonPress
  | PipResizeButtonPress
  | OsdUpDownButtonPress
  | OsdLeftRightButtonPress
  | OsdSelectButtonPress
  | ExitMonitorSettingSegmentPress

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
---- Monitor Setting Actions
    CloseMonitorConfiguration -> model ! []
      -- let homeScreenState' = appState.homeScreenState
      --     monitorSettingScreenState' = appState.monitorSettingScreenState
      -- in { appState | viewState = 1
      --               , homeScreenState = { homeScreenState' | monitors = updateMonitorList monitorSettingScreenState'.selectedMonitor homeScreenState'.monitors } }
    SignalInputToggle signalType -> model ! []
      -- let monitorSettingScreenState' = appState.monitorSettingScreenState
      --     selectedMonitor'  = monitorSettingScreenState'.selectedMonitor
      -- in { appState | monitorSettingScreenState = { monitorSettingScreenState' | selectedMonitor =  activateCycleSignalMatrix signalType selectedMonitor' } }
    PipButtonPress -> model ! []
      -- let monitorSettingScreenState' = appState.monitorSettingScreenState
      -- in { appState | monitorSettingScreenState = { monitorSettingScreenState'| segmentState = Pip } }
    OsdButtonPress -> model ! []
      -- let monitorSettingScreenState' = appState.monitorSettingScreenState
      -- in { appState | monitorSettingScreenState = { monitorSettingScreenState'| segmentState = Osd } }
    PipUpDownButtonPress -> model ! []
      -- let monitorSettingScreenState' = appState.monitorSettingScreenState
      -- in { appState | monitorSettingScreenState = setPipUpDownButtonPress monitorSettingScreenState' }
    PipLeftRightButtonPress -> model ! []
      -- let monitorSettingScreenState' = appState.monitorSettingScreenState
      -- in { appState | monitorSettingScreenState = setPipLeftRightButtonPress monitorSettingScreenState' }
    PipResizeButtonPress -> model ! []
      -- let monitorSettingScreenState' = appState.monitorSettingScreenState
      -- in { appState | monitorSettingScreenState = setPipResizeButtonPress monitorSettingScreenState' }
    OsdUpDownButtonPress -> model ! []
      -- let monitorSettingScreenState' = appState.monitorSettingScreenState
      -- in { appState | monitorSettingScreenState = setOsdUpDownButtonPress monitorSettingScreenState' }
    OsdLeftRightButtonPress -> model ! []
      -- let monitorSettingScreenState' = appState.monitorSettingScreenState
      -- in { appState | monitorSettingScreenState = setOsdLeftRightButtonPress monitorSettingScreenState' }
    OsdSelectButtonPress -> model ! []
      -- let monitorSettingScreenState' = appState.monitorSettingScreenState
      -- in { appState | monitorSettingScreenState = setOsdSelectButtonPress monitorSettingScreenState' }
    ExitMonitorSettingSegmentPress -> model ! []
      -- let monitorSettingScreenState' = appState.monitorSettingScreenState
      -- in { appState | monitorSettingScreenState = { monitorSettingScreenState' | segmentState = None }  }

init : (Model, Cmd Msg)
init = defaultModel ! []

view : Model -> Html Msg
view model =
  let (upperBodyStyle, lowerBodyStyle) = getThemeStyle model.selectedTheme
  in div  [ class "main" ]
          [ monitorSettingTopBarView model upperBodyStyle
          , monitorSettingBodyView model lowerBodyStyle ]

-- top bar for monitor setting view
monitorSettingTopBarView : Model -> (String, String) -> Html Msg
monitorSettingTopBarView monitorSettingScreenState style' =
  div [ class "app-top-bar vdiv-1-10", style [ style' ] ]
      [ div [ class "div-1-10 vdiv-1-1 content-centered nav-header" ]
            [ appTopBarHeader ("#" ++ monitorSettingScreenState.selectedMonitor.number) ]
      , div [ class "div-1-10 float-right", onClick CloseMonitorConfiguration ] [ closeIconView ] ]

-- main body for monitor setting view
monitorSettingBodyView : Model -> (String, String) -> Html Msg
monitorSettingBodyView model style' =
  div [ class "app-body vdiv-9-10", style [ style' ] ]
      [ monitorSettingUpperBodyView model
      , monitorSettingLowerBodyView model ]

-- monitor setting upper body view
monitorSettingUpperBodyView : Model -> Html Msg
monitorSettingUpperBodyView model =
  let monitor = model.selectedMonitor
  in div [ class "monitor-setting-upper-body div-1-1" ]
          [ div [ class "div-1-3 vdiv-1-1" ]
                [ signalMatrixView "VGA 1" monitor.vgaOne model monitor
                , signalMatrixView "VGA 2" monitor.vgaTwo model monitor ]
          , div [ class "div-1-3 vdiv-1-1" ]   [ signalMatrixView "DVI 1" monitor.dviOne model monitor
                , signalMatrixView "DVI 2" monitor.dviTwo model monitor ]
          , div [ class "div-1-3 vdiv-1-1" ]   [ signalMatrixView "VIDEO 1" monitor.videoOne model monitor
                , signalMatrixView "VIDEO 2" monitor.videoTwo model monitor
                , signalMatrixView "VIDEO 3" monitor.videoThree model monitor]]

monitorSettingLowerBodyView : Model -> Html Msg
monitorSettingLowerBodyView model =
  let view =  case model.segmentState of
                None -> monitorSettingSegmentStateViewNone model
                Pip -> monitorSettingSegmentStateViewPip model
                Osd -> monitorSettingSegmentStateViewOsd model
  in div  [ class "monitor-setting-lower-body" ]
          [ view ]


-- monitor lower body view
monitorSettingSegmentStateViewNone : Model -> Html Msg
monitorSettingSegmentStateViewNone monitor =
  div [ class "div-1-1 vdiv-1-1 content-centered" ]
      [ div [ class "div-4-5 vdiv-4-5" ]
            [ div [ class "div-1-4 content-centered" ]
                  [ div [ class "div-3-4 vdiv-3-4 pip-button monitor-button content-centered "
                        , onClick PipButtonPress ]
                        [ pipIcon ] ]
            , div [ class "div-1-4 content-centered" ]
                  [ div [ class "div-3-4 vdiv-3-4 pip-button monitor-button content-centered "
                        , onClick OsdButtonPress ]
                        [ osdIcon ] ] ] ]

monitorSettingSegmentStateViewPip : Model -> Html Msg
monitorSettingSegmentStateViewPip model =
  let monitor = model.selectedMonitor
      isLeftRightOn = if monitor.isPipLeftRightPressed then "disabled" else ""
      isUpDownOn = if monitor.isPipUpDownPressed then "disabled" else ""
      isResizeOn = if monitor.isPipResizePressed then "disabled" else ""
  in  div [ class "div-1-1 vdiv-1-1 content-centered" ]
          [ div [ class "div-4-5 vdiv-4-5" ]
                [ div [ class "div-1-4 content-centered" ]
                      [ div [ class ("div-3-4 vdiv-3-4 pip-button monitor-button content-centered " ++ isLeftRightOn)
                            , onClick PipLeftRightButtonPress ]
                            [ leftRightIcon monitor.isPipLeftRightPressed ] ]
                , div [ class "div-1-4 content-centered" ]
                      [ div [ class ("div-3-4 vdiv-3-4 pip-button monitor-button content-centered " ++ isUpDownOn)
                            , onClick PipUpDownButtonPress ]
                            [ upDownIcon monitor.isPipUpDownPressed ] ]
                , div [ class "div-1-4 content-centered" ]
                      [ div [ class ("div-3-4 vdiv-3-4 pip-button monitor-button content-centered " ++ isResizeOn)
                            , onClick PipResizeButtonPress ]
                            [ resizeIcon monitor.isPipResizePressed ] ]
                , div [ class "div-1-4 content-centered" ]
                      [ div [ class "div-3-4 vdiv-3-4 pip-button monitor-button content-centered "
                            , onClick ExitMonitorSettingSegmentPress ]
                            [ exitPipIcon ] ] ] ]

monitorSettingSegmentStateViewOsd: Model -> Html Msg
monitorSettingSegmentStateViewOsd monitorSettingState =
  let monitor = monitorSettingState.selectedMonitor
      isLeftRightOn = if monitor.isOsdLeftRightPressed then "disabled" else ""
      isUpDownOn = if monitor.isOsdUpDownPressed then "disabled" else ""
      isSelectedOn = if monitor.isOsdSelectPressed then "disabled" else ""
  in  div [ class "div-1-1 vdiv-1-1 content-centered" ]
          [ div [ class "div-4-5 vdiv-4-5" ]
                [ div [ class "div-1-4 content-centered" ]
                      [ div [ class ("div-3-4 vdiv-3-4 osd-button monitor-button content-centered " ++ isLeftRightOn)
                            , onClick OsdLeftRightButtonPress ]
                            [ leftRightIcon monitor.isOsdLeftRightPressed ] ]
                , div [ class "div-1-4 content-centered" ]
                      [ div [ class ("div-3-4 vdiv-3-4 osd-button monitor-button content-centered " ++ isUpDownOn)
                            , onClick OsdUpDownButtonPress ]
                            [ upDownIcon monitor.isOsdUpDownPressed ] ]
                , div [ class "div-1-4 content-centered" ]
                      [ div [ class ("div-3-4 vdiv-3-4 osd-button monitor-button content-centered " ++ isSelectedOn)
                            , onClick OsdSelectButtonPress ]
                            [ selectIcon monitor.isOsdSelectPressed ] ]
                , div [ class "div-1-4 content-centered" ]
                      [ div [ class "div-3-4 vdiv-3-4 pip-button monitor-button content-centered "
                            , onClick ExitMonitorSettingSegmentPress ]
                            [ exitOsdIcon ] ] ] ]

-- signal matrix view
signalMatrixView : String -> String -> Model -> Monitor -> Html Msg
signalMatrixView signalType signalName monitorSettingScreenState monitor =
  let isActivated = case signalType of
                        "VGA 1" -> monitor.isVgaOneCycle
                        "VGA 2" -> monitor.isVgaTwoCycle
                        "DVI 1" -> monitor.isDviOneCycle
                        "DVI 2" -> monitor.isDviTwoCycle
                        "VIDEO 1" -> monitor.isVideoOneCycle
                        "VIDEO 2" -> monitor.isVideoTwoCycle
                        "VIDEO 3" -> monitor.isVideoThreeCycle
                        _ -> False
  in div  [ class "signal-matrix-view vdiv-1-3" ]
          [ div [ class "signal-matrix-label div-1-1 vdiv-1-2 content-centered" ]
              [ text signalType ]
          , div [ class "signal-matrix-container div-1-1 vdiv-1-2" ]
              [ div [ class ("div-1-1 vdiv-1-1 content-centered " ++ signalType) ]
                    [ span  [ class ("signal-matrix-input div-3-5 vdiv-1-1 content-centered " ++ (if isActivated then " activated" else ""))
                            , onClick (SignalInputToggle signalType) ]
                            [ text signalName ] ] ]
          , div [ class "clear-both" ] [ ] ]

-- view for pip buttons set
pipButtonSetView : Model -> Html Msg
pipButtonSetView model =
  let isVisible = if not model.isPipSetPressed then "hidden" else ""
      monitor = model.selectedMonitor
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
                            [ img [ class "vdiv-1-1", src leftRightSrc, onClick PipLeftRightButtonPress ] [ ] ] ]
                , div [ class "div-1-2 align-center" ]
                      [ div [ class "vdiv-1-5" ]
                            [ text "UP/DOWN" ]
                      , div [ class "vdiv-4-5" ]
                            [ img [ class "vdiv-1-1", src upDownSrc, onClick PipUpDownButtonPress ] [ ] ] ]
                ]
          , div [ class "vdiv-1-2 align-center" ]
                [ div [ class "div-1-1 align-center" ]
                      [ div [ class "vdiv-1-5" ]
                            [ text "RESIZE" ]
                      , div [ class "vdiv-4-5" ]
                            [ img [ class "vdiv-1-1", src resizeSrc, onClick PipResizeButtonPress ] [ ] ] ] ]
          ]

-- view for pip buttons set
osdButtonSetView : Model -> Html Msg
osdButtonSetView model =
  let isVisible = if not model.isOsdSetPressed then "hidden" else ""
      monitor = model.selectedMonitor
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
                            [ img [ class "vdiv-1-1", src leftRightSrc, onClick OsdLeftRightButtonPress ] [ ] ] ]
                , div [ class "div-1-2 align-center" ]
                      [ div [ class "vdiv-1-5" ]
                            [ text "UP/DOWN" ]
                      , div [ class "vdiv-4-5" ]
                            [ img [ class "vdiv-1-1", src upDownSrc, onClick OsdUpDownButtonPress ] [ ] ] ]
                ]
          , div [ class "vdiv-1-2 align-center" ]
                [ div [ class "div-1-1 align-center" ]
                      [ div [ class "vdiv-1-5" ]
                            [ text "SELECT" ]
                      , div [ class "vdiv-4-5" ]
                            [ img [ class "vdiv-1-1", src selectSrc, onClick OsdSelectButtonPress ] [ ] ] ] ]
          ]
