module SystemPreferences exposing (..)

import Types exposing (..)
import Icons exposing (..)
import Commons exposing (..)
import Ports

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

-- MODEL
type alias Model =  { viewState : ViewState
                    , selectedTheme : Theme }

type ViewState = Home | MonitorCount | Themes | SoftwareUpdate

defaultModel : Model
defaultModel = { viewState = Home
               , selectedTheme = DefaultTheme }

type Msg
  = NoOp
  | CloseSystemPreferences

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    NoOp -> model ! []
    CloseSystemPreferences -> model ! [ Ports.out_onSystemPreferencesClose "" ]

init : (Model, Cmd Msg)
init = defaultModel ! []

view : Model -> Html Msg
view model =
  let
    (upperBodyStyle, lowerBodyStyle) = getThemeStyle model.selectedTheme
  in div  [ class "main" ]
          [ systemPreferencesTopBarView model upperBodyStyle
          , systemPreferencesBodyView model lowerBodyStyle ]

-- top bar for monitor setting view
systemPreferencesTopBarView : Model -> (String, String) -> Html Msg
systemPreferencesTopBarView model style' =
  div [ class "app-top-bar vdiv-1-10", style [ style' ] ]
      [ div [ class "div-1-10 vdiv-1-1 content-centered nav-header" ]
            [ appTopBarHeaderIcon systemPreferencesIconHeader ]
      , div [ class "div-1-10 float-right", onClick CloseSystemPreferences ] [ closeIconView ] ]

-- main body for monitor setting view
systemPreferencesBodyView : Model -> (String, String) -> Html Msg
systemPreferencesBodyView model style' =
  div [ class "app-body vdiv-9-10", style [ style' ] ]
      [ ]

-- WIRING --
-- subscriptions : Model -> Sub Msg
-- subscriptions model = Ports.in_startEditingMonitor StartEditingMonitor
