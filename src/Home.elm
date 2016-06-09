module Home exposing (..)

import Ports exposing (..)
import Types exposing (..)
import GreenGui.Widgets exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

-- MODEL
type alias Model =  { componentId : Int
                    , monitors : List Monitor
                    , monitorsPerPage : Int
                    , monitorPageIndex : Int
                    , isPowerDisabled : Bool
                    , isSelectAllActive : Bool
                    , test : Int
                    , selectedTheme : Theme
                    }

defaultModel : Model
defaultModel =    { componentId = 1
                  , monitors =  [ defaultMonitor "1" True
                                , defaultMonitor "2" True
                                , defaultMonitor "3" True
                                , defaultMonitor "4" True
                                , defaultMonitor "5" True
                                , defaultMonitor "6" True
                                , defaultMonitor "7" True
                                , defaultMonitor "8" True
                                , defaultMonitor "9" True
                                , defaultMonitor "10" True
                                , defaultMonitor "11" True
                                , defaultMonitor "12" True ]
                  , monitorsPerPage = 5
                  , monitorPageIndex = 0
                  , isPowerDisabled = True
                  , isSelectAllActive = True
                  , test = 0
                  , selectedTheme = DefaultTheme
                  }

type Msg
  = UpdateValue Int
  | SelectMonitor Monitor
  | SelectAllMonitors
  | MonitorPressedDown String
  | MonitorPressReleased String
  | LongPressedMonitor String
  | SelectMonitorToConfigure Monitor
  | LockScreenPressed String
  | PowerPress
  | PresetPress
  | SystemPreferencesPress

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    UpdateValue val -> { model | test = val } ! []
    SelectMonitor monitor ->
      let monitors' = toggleMonitorAsSelected monitor model.monitors
          powerMustBeDisabled = if List.length (List.filter (\m -> m.isSelected ) monitors') > 0 then False else True
      in { model  | monitors = model.monitors
                  , isPowerDisabled = powerMustBeDisabled } ! []
    SelectAllMonitors ->
      let model' = model
      in { model  | monitors = setAllMonitorAsSelected model.monitors model.isSelectAllActive
                  , isPowerDisabled = False
                  , isSelectAllActive = not model.isSelectAllActive } ! []
    SelectMonitorToConfigure monitor' ->
      let model' = model
      in { model  | monitors = setMonitorAsSelected monitor' model'.monitors } ! []
    MonitorPressedDown number -> model ! []
    MonitorPressReleased number -> model ! []
    LongPressedMonitor number ->
      let model' = model
          foundMonitor = findMonitor number model'.monitors
      in { model  | monitors = setMonitorAsSelected foundMonitor model'.monitors } ! []

    PowerPress ->
      { model | monitors = setSelectedMonitorsToPowerPress model.monitors } ! []
    PresetPress -> model ! []
    SystemPreferencesPress -> model ! []
    LockScreenPressed temporary -> model ! []
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
setAllMonitorAsSelected : List Monitor -> Bool -> List Monitor
setAllMonitorAsSelected  monitors isSelected' =
  List.map (\m -> { m | isSelected = isSelected' } ) monitors

-- moves monitor pages left and right : negative for left, positive for right
flipMonitorPage : Int -> Int -> Int -> Model -> Model
flipMonitorPage flips maxFlips monitorsPerPage model =
  let monitors' = model.monitors
      newPageIndex = clamp 0 (maxFlips - 1) (model.monitorPageIndex + flips)
  in
    { model | monitorPageIndex = newPageIndex
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

init : (Model, Cmd Msg)
init = defaultModel ! []

view : Model -> Html Msg
view model =
  let (upperBodyStyle, lowerBodyStyle) = getThemeStyle model.selectedTheme
  in div  [ class "main", style [upperBodyStyle] ]
          [ monitorPanelView model
          , homePanelView model
          , homeMenuView [lowerBodyStyle]
          , buildVersion
          ]

-- monitor panel view contains buttons container and pager
monitorPanelView model =
  div [ class "monitor-panel-view" ]
      [ monitorViewPager model
      , div [ class "div-1-1 vdiv-4-5 monitor-views-parent" ] [ div [ class "monitor-views div-1-1" ] ( monitorViewButtons model  ) ] ]

-- list of monitor buttons
monitorViewButtons model =
  (List.map (monitorViewButton model.monitorsPerPage) model.monitors)

--- view of a monitor button
monitorViewButton monitorsPerPage monitor =
  let maxMonitorDisplays = toString monitorsPerPage
  in
    div [ class ("div-1-" ++ maxMonitorDisplays ++ " monitor-view-container ") ]
    [ div [ class "monitor-view content-centered"
          , onClick (SelectMonitor monitor)
          , onDoubleClick (SelectMonitorToConfigure monitor)
          , onMouseDown (MonitorPressedDown monitor.number)
          , onMouseUp (MonitorPressReleased monitor.number) ]
          [ div [ class "div-4-5 vdiv-4-5" ]
                [ div [ class "div-1-1 vdiv-1-1" ] [ monitorIcon monitor.number monitor.isSelected ] ] ]
    ]

--- view of a monitor view pager, it is located at the upper portion of the screen
monitorViewPager screenState =
  div [ class "monitor-pager-view" ]
      [ div [ class "div-1-10 vdiv-1-1" ] [ ]
      , div [ class "div-4-5 vdiv-1-1" ]
            [ div [ class "div-1-1 vdiv-2-5" ] [ ]
            , div [ class "div-1-1 vdiv-3-5 content-centered" ]
                  [ div [ class "div-1-5 vdiv-1-1 monitor-selectall-button", onClick SelectAllMonitors]
                        [ div [ class "div-1-1 vdiv-1-10" ] [ ]
                        , div [ class "div-1-1 vdiv-4-5 content-centered" ] [ selectAllIcon ]
                        , div [ class "div-1-1 vdiv-1-10" ] [ ] ]
                  ]
            ]
      , div [ class "div-1-10 vdiv-1-1" ] [ ]
      ]

--- view of the home panel, the home panel is located on the center of the screen
homePanelView model =
  let powerButtonState = if model.isPowerDisabled then "_disabled" else ""
  in div  [ class "home-panel-view" ]
          [ div [ class "home-panel-division div-1-4 vdiv-1-1" ]
                [ div [ class ("content-centered power " ++ powerButtonState), onClick PowerPress ]
                      [ div [ class "div-3-5 vdiv-3-5" ]
                            [ powerIcon model.isPowerDisabled ] ] ]
          , div [ class "home-panel-division div-1-4 vdiv-1-1" ]
                [ brightnessSetupIcon
                -- div [ class "content-centered overlap" ]
                --       [ div [ class "div-1-10 vdiv-7-10"] [ ]
                --       , div [ class "div-3-5 vdiv-7-10" ] [ decrementIcon ]
                --       , div [ class "div-1-10 vdiv-7-10"] [ ]
                --       , div [ class "div-1-10 vdiv-7-10"] [ ]
                --       , div [ class "div-3-5 vdiv-7-10" ] [ incrementIcon ]
                --       , div [ class "div-1-10 vdiv-7-10"] [ ] ]
                -- , div [ class "content-centered overlap "]
                --       [ div [ class "div-1-10 vdiv-7-10"] [ ]
                --       , div [ class "div-3-5 vdiv-7-10" ] [ decrementIcon ]
                --       , div [ class "div-1-10 vdiv-7-10"] [ ] ]
                ]
          , div [ class "home-panel-division div-1-4 vdiv-1-1" ]
                [ div [ class "content-centered night-mode" ]
                      [ div [ class "div-3-5 vdiv-3-5" ]
                            [ nightModeIcon ] ] ]
          , div [ class "home-panel-division div-1-4 vdiv-1-1" ]
                [ div [ class " content-centered presets" ]
                      [ div [ class "div-3-5 vdiv-3-5" ]
                            [ pipMenuIcon ] ] ] ]

--- view of menus of the home panel, it is located at the bottom of the screen
homeMenuView style' =
  div [ class "sub-panel-view", style style' ]
      [ div [ class "home-menu-item vdiv-1-1 div-1-4 content-centered", onClick (LockScreenPressed "") ]
            [ div [ class "content-centered vdiv-1-1 div-1-1" ] [ lockIcon ] ]
      , div [ class "home-menu-item vdiv-1-1 div-1-4 content-centered", onClick PresetPress ]
            [ div [ class "content-centered vdiv-1-1 div-1-1" ] [ presetIcon ] ]
      , div [ class "home-menu-item vdiv-1-1 div-1-4 content-centered", onClick SystemPreferencesPress ]
            [ div [ class "content-centered vdiv-1-1 div-1-1" ] [ menuIcon ] ]
      , div [ class "home-menu-item vdiv-1-1 div-1-4 content-centered" ]
            [ div [ class "content-centered vdiv-1-1 div-1-1" ] [ informationIcon ] ] ]

buildVersion : Html Msg
buildVersion =
  div [ class "build-version" ] [ text "v.1.052520161350" ]

-- WIRING
subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
      [ fromJS UpdateValue ]