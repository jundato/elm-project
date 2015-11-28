module GreenGui.Home (Action, update, view) where
-- initial page that should be displayed, it contains the list of monitors, power down, etc.

import GreenGui.Types exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Lazy exposing (lazy, lazy2, lazy3)

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
      in { appState | currentScreenState = 2
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
      in { appState | currentScreenState = 2
                    , homeScreenState = { homeScreenState' | monitors = setMonitorAsSelected foundMonitor homeScreenState'.monitors }
                    , monitorSettingScreenState = { monitorSettingScreenState' | selectedMonitor = foundMonitor
                                                                                , isPipSetPressed = False
                                                                                , isOsdSetPressed = False } }
 
    PowerPress ->
      let homeScreenState' = appState.homeScreenState
      in { appState | homeScreenState = { homeScreenState' | monitors = setSelectedMonitorsToPowerPress homeScreenState'.monitors } }
    PresetPress ->
      let monitorSettingScreenState' = appState.monitorSettingScreenState
      in { appState | currentScreenState = 3 }
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
  List.map (\m -> if m.isSelected then { m | isOn = not m.isSelected }
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

-- home screen view
view address homeScreenState =
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
  let visibility =  if monitor.isVisible /= True then "hidden"
                    else ""
      isHighlighted = if monitor.isSelected then "selected"
                      else ""
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



