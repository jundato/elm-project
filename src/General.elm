module General exposing (..)

import Icons exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)

appTopBarHeader : String -> Html msg
appTopBarHeader value =
  div [ class "div-1-1 vdiv-1-1" ]
      [ div [ class "div-1-1 vdiv-1-5" ] [ ]
      , div [ class "div-1-1 vdiv-3-5" ] [ labelLeftIcon value ] ]

appTopBarHeaderIcon : Html msg -> Html msg
appTopBarHeaderIcon html =
  div [ class "div-1-1 vdiv-1-1" ]
      [ div [ class "div-1-1 vdiv-1-1" ] [ html ] ]

closeIconView : Html msg
closeIconView =
  div [ class "div-1-1 vdiv-1-1" ]
      [ div [ class "div-1-1 vdiv-1-5" ] [ ]
      , div [ class "div-1-1 vdiv-3-5" ] [ closeIcon ] ]
