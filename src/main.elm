-- author: virgilio dato
-- temporary site : http://ghoulish-scarecrow-6363.herokuapp.com/

import Html exposing (..)
import Html.App as App
import Html exposing (..)
import Basics

import MainPorts

import Home
import MonitorSetup
import SystemPreferences
import Lock
import Presets

type alias Model =
  { homeModel : Home.Model
  , monitorSetupModel : MonitorSetup.Model
  , systemPreferencesModel : SystemPreferences.Model
  , lockModel : Lock.Model
  , presetsModel : Presets.Model
  , viewMode : ViewMode }

type ViewMode = HomeMode | MonitorSetupMode | SystemPreferencesMode | LockScreenMode | PresetsMode

init : ( Model, Cmd Msg )
init =
  let
    (homeVal, homeCmd) = Home.init
    (monitorSetupVal, monitorSetupCmd) = MonitorSetup.init
    (systemPreferencesVal, systemPreferencesCmd) = SystemPreferences.init
    (lockVal, lockCmd) = Lock.init
    (presetsVal, presetCmd) = Presets.init
  in
    (Model homeVal monitorSetupVal systemPreferencesVal lockVal presetsVal HomeMode,
      Cmd.batch [ Cmd.map HomeMainMsg homeCmd
                , Cmd.map MonitorSetupMainMsg monitorSetupCmd
                , Cmd.map SystemPreferencesMsg systemPreferencesCmd
                , Cmd.map LockMsg lockCmd
                , Cmd.map PresetsMsg presetCmd ])
-- UPDATE

type Msg
  = HomeMainMsg Home.Msg
  | MonitorSetupMainMsg MonitorSetup.Msg
  | SystemPreferencesMsg SystemPreferences.Msg
  | LockMsg Lock.Msg
  | PresetsMsg Presets.Msg
  | MonitorSetup String
  | UnlockLockCountdown String
  | UpdateLockCountdownSecondsLeft Int
  | OpenSystemPreferences String
  | ReturnToHomeMode String
  | LockScreen String
  | ManagePresets String

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
    LockMsg lockMsg ->
      let
        (newLockModel, cmd) = Lock.update lockMsg  model.lockModel
      in
        { model | lockModel = newLockModel } ! [Cmd.map LockMsg cmd]
    PresetsMsg presetMsg ->
      let
        (newPresetsModel, cmd) = Presets.update presetMsg  model.presetsModel
      in
        { model | presetsModel = newPresetsModel } ! [Cmd.map PresetsMsg cmd]
    MonitorSetup val -> { model  | viewMode = MonitorSetupMode } ! [ ]
    UnlockLockCountdown val ->
      model ! [ ]
    UpdateLockCountdownSecondsLeft val ->
      model ! [ ]
    OpenSystemPreferences tmp -> { model | viewMode = SystemPreferencesMode } ! [ ]
    ReturnToHomeMode tmp -> { model | viewMode = HomeMode } ! [ ]
    LockScreen tmp -> { model | viewMode = LockScreenMode } ! [ ]
    ManagePresets tmp -> { model | viewMode = PresetsMode } ! [ ]

view : Model -> Html Msg
view model =
  let view =
    case model.viewMode of
      HomeMode -> App.map HomeMainMsg (Home.view model.homeModel)
      MonitorSetupMode -> App.map MonitorSetupMainMsg (MonitorSetup.view model.monitorSetupModel)
      SystemPreferencesMode -> App.map SystemPreferencesMsg (SystemPreferences.view model.systemPreferencesModel)
      LockScreenMode -> App.map LockMsg (Lock.view model.lockModel)
      PresetsMode -> App.map PresetsMsg (Presets.view model.presetsModel)
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
    , Sub.map LockMsg (Lock.subscriptions model.lockModel)
    , MainPorts.in_managePresets ManagePresets
    , MainPorts.in_monitorSetup MonitorSetup
    , MainPorts.in_returnToHomeMode ReturnToHomeMode
    , MainPorts.in_openSystemPreferences OpenSystemPreferences
    , MainPorts.in_lockScreen LockScreen ]
