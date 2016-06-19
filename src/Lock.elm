module Lock exposing (..)

import Types exposing (..)
import Commons exposing (..)
import Ports

import Html exposing (..)
import Html.Attributes exposing (..)

-- MODEL
type alias Model =  { selectedTheme : Theme
                    , secondsLeft : Int }

defaultModel : Model
defaultModel =  { selectedTheme = DefaultTheme
                , secondsLeft = 30 }

type Msg
  = UpdateSecondsLeft Int

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    UpdateSecondsLeft newSecondsLeft -> { model | secondsLeft = newSecondsLeft } ! [ ]

init : (Model, Cmd Msg)
init = defaultModel ! []

view : Model -> Html Msg
view model =
  let
    (_, style') = getThemeStyle model.selectedTheme
  in div  [ class "main" ]
          [ lockCountdownScreenView model style' ]

lockCountdownScreenView : Model -> (String, String) -> Html Msg
lockCountdownScreenView model style' =
  div [ class "vdiv-1-1 div-1-1"
      , style [style']]
      [ div [ class "vdiv-1-3 div-1-1" ] [ ]
      , div [ class "vdiv-1-3 div-1-1 content-centered lock-countdown-timer" ] [ text ("Unlocking in " ++ (toString model.secondsLeft) ++ " seconds") ]
      , div [ class "vdiv-1-3 div-1-1" ] [ ] ]

-- WIRING --
subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
    [ Ports.in_updateSecondsLeft UpdateSecondsLeft ]
