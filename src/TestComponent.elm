module TestComponent exposing (..)

import Html exposing (..)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)

import Ports exposing (..)

-- MODEL

type alias Model = Int

init : (Model, Cmd Msg)
init = 0 ! []

-- UPDATE

type Msg = Increment | Decrement | UpdateValue Int

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    Increment -> model ! [toJS "Increment"]
    Decrement -> model ! [toJS "Decrement"]
    UpdateValue val -> (model + val) ! []

-- VIEW

view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [ countStyle ] [ text (toString model) ]
    , button [ onClick Increment ] [ text "+" ]
    ]


countStyle : Attribute Msg
countStyle =
  style
    [ ("font-size", "20px")
    , ("font-family", "monospace")
    , ("display", "inline-block")
    , ("width", "50px")
    , ("text-align", "center")
    ]

-- WIRING

subscriptions : Model -> Sub Msg
subscriptions model =
  fromJS UpdateValue
