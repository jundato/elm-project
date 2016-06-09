-- author: virgilio dato
-- temporary site : http://ghoulish-scarecrow-6363.herokuapp.com/

import Html exposing (..)
import Html.App as App
import Html exposing (..)
import Basics
import Ports
import Home

type alias Model =
  { homeModel : Home.Model
  , viewState : Int }

init : ( Model, Cmd Msg )
init =
  let
    (val, cmd) = Home.init
  in
    Model val 0 ! [Cmd.map HomeMainMsg cmd]
-- UPDATE

type Msg
  = HomeMainMsg Home.Msg
  | LongPressedMonitor String
  | UnlockLockCountdown String
  | UpdateLockCountdownSecondsLeft Int

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    HomeMainMsg compMsg ->
      let
        (newHomeModel, cmd) = Home.update compMsg model.homeModel
      in
        { model | homeModel = newHomeModel } ! [Cmd.map HomeMainMsg cmd]
    LongPressedMonitor val ->
      { model | viewState = 1 } ! [ ]
    UnlockLockCountdown val ->
      model ! [ ]
    UpdateLockCountdownSecondsLeft val ->
      model ! [ ]

view : Model -> Html Msg
view model =
  div [ ] [ App.map HomeMainMsg (Home.view model.homeModel)  ]

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
    , Ports.in_longPressedMonitor LongPressedMonitor ]
