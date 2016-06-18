-- author: virgilio dato
-- temporary site : http://ghoulish-scarecrow-6363.herokuapp.com/

import Html exposing (..)
import Html.App as App
import Html exposing (..)
import Basics

import Types exposing (..)
import Ports
import Home
import MonitorSetup
import SystemPreferences

type alias Model =
  { homeModel : Home.Model
  , monitorSetupModel : MonitorSetup.Model
  , systemPreferencesModel : SystemPreferences.Model
  , viewMode : ViewMode }

type ViewMode = HomeMode | MonitorSetupMode | SystemPreferencesMode

init : ( Model, Cmd Msg )
init =
  let
    (homeVal, homeCmd) = Home.init
    (monitorSetupVal, monitorSetupCmd) = MonitorSetup.init
    (systemPreferencesVal, systemPreferencesCmd) = SystemPreferences.init
  in
    (Model homeVal monitorSetupVal systemPreferencesVal HomeMode,
      Cmd.batch [ Cmd.map HomeMainMsg homeCmd
                , Cmd.map MonitorSetupMainMsg monitorSetupCmd
                , Cmd.map SystemPreferencesMsg systemPreferencesCmd ])
-- UPDATE

type Msg
  = HomeMainMsg Home.Msg
  | MonitorSetupMainMsg MonitorSetup.Msg
  | SystemPreferencesMsg SystemPreferences.Msg
  | LongPressedMonitor Monitor
  | UnlockLockCountdown String
  | UpdateLockCountdownSecondsLeft Int
  | OpenSystemPreferences String
  | ReturnToHomeMode String

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    HomeMainMsg homeMainMsg ->
      let
        (newHomeModel, cmd) = Home.update homeMainMsg model.homeModel
      in
        { model | homeModel = newHomeModel } ! [Cmd.map HomeMainMsg cmd]
    MonitorSetupMainMsg monitorSetupMainMsg ->
      let
        (newMonitorSetupModel, cmd) = MonitorSetup.update monitorSetupMainMsg  model.monitorSetupModel
      in
        { model | monitorSetupModel = newMonitorSetupModel } ! [Cmd.map MonitorSetupMainMsg cmd]
    SystemPreferencesMsg systemPreferencesMsg ->
      let
        (newSystemPreferencesModel, cmd) = SystemPreferences.update systemPreferencesMsg  model.systemPreferencesModel
      in
        { model | systemPreferencesModel = newSystemPreferencesModel } ! [Cmd.map SystemPreferencesMsg cmd]
    LongPressedMonitor val -> { model  | viewMode = MonitorSetupMode } ! [ ]
    UnlockLockCountdown val ->
      model ! [ ]
    UpdateLockCountdownSecondsLeft val ->
      model ! [ ]
    OpenSystemPreferences tmp -> { model | viewMode = SystemPreferencesMode } ! [ ]
    ReturnToHomeMode tmp -> { model | viewMode = HomeMode } ! [ ]

view : Model -> Html Msg
view model =
  let view =
    case model.viewMode of
      HomeMode -> App.map HomeMainMsg (Home.view model.homeModel)
      MonitorSetupMode -> App.map MonitorSetupMainMsg (MonitorSetup.view model.monitorSetupModel)
      SystemPreferencesMode -> App.map SystemPreferencesMsg (SystemPreferences.view model.systemPreferencesModel)
  in div [ ] [ view ]

--- entry point
main : Program Never
main =
  App.program
    { init = init
    , update = update
    , view = view
    , subscriptions = subscriptions}

-- WIRING --
subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
    [ Sub.map HomeMainMsg (Home.subscriptions model.homeModel)
    , Sub.map MonitorSetupMainMsg (MonitorSetup.subscriptions model.monitorSetupModel)
    , Ports.in_longPressedMonitor LongPressedMonitor
    , Ports.in_returnToHomeMode ReturnToHomeMode
    , Ports.in_openSystemPreferences OpenSystemPreferences ]
