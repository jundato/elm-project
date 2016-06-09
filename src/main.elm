-- author: virgilio dato
-- temporary site : http://ghoulish-scarecrow-6363.herokuapp.com/

import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Lazy exposing (lazy, lazy2, lazy3)
import Html exposing (..)
import List
import Html.Lazy exposing (lazy, lazy2, lazy3)
import Basics
import String
import Debug
import Json.Decode as Json
import Ports
import GreenGui.Widgets exposing (..)
import Home

type alias Model =
  { homeModel : Home.Model
  , viewState : Int }

init : ( Model, Cmd Msg )
init =
  let
    (val, cmd) = Home.init
  in
    Model val 0 ! [Cmd.map MainMsg cmd]
-- UPDATE

type Msg
  = MainMsg Home.Msg
  | LongPressedMonitor String
  | UnlockLockCountdown String
  | UpdateLockCountdownSecondsLeft Int

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    MainMsg compMsg ->
      let
        (newHomeModel, cmd) = Home.update compMsg model.homeModel
      in
        { model | homeModel = newHomeModel } ! [Cmd.map MainMsg cmd]
    LongPressedMonitor val ->
      model ! [ ]
    UnlockLockCountdown val ->
      model ! [ ]
    UpdateLockCountdownSecondsLeft val ->
      model ! [ ]

view : Model -> Html Msg
view model =
  div [ ] [ App.map MainMsg (Home.view model.homeModel)  ]

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
    [ Sub.map MainMsg (Home.subscriptions model.homeModel) ]
