module Icons exposing (..)

import Svg exposing (..)
import Svg.Attributes exposing (..)

selectAllIcon : Svg msg
selectAllIcon =
  let containerWidth = 204
      containerHeight = 48
      color = "#231f20"
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.rect  [ height "9.2"
                      , width "81.3"
                      , fill color
                      , x "9.95"
                      , y "19.1" ] [ ]
          , Svg.rect  [ height "9.2"
                      , width "81.3"
                      , fill color
                      , x "110.85"
                      , y "19.1" ] [ ]
          , Svg.polygon [ points "0 23.74 23.74 0 29.18 5.7 11.41 23.47 29.57 41.64 23.87 47.35 0 23.74"
                        , fill color ] [ ]
          , Svg.polygon [ points "202.09 23.74 178.35 0 172.91 5.7 190.69 23.47 172.51 41.64 178.22 47.35 202.09 23.74"
                        , fill color ] [ ]]

powerIcon : Bool -> Svg msg
powerIcon isDisabled =
  let containerWidth = 128
      containerHeight = 128
      color = if isDisabled then "#414042" else "#B71318"
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.path  [ d "M70.9,40.8c9.4,3.5,16,12.6,16,23.2c0,13.7-11.1,24.8-24.8,24.8S37.5,77.7,37.5,64c0-10.6,6.7-19.7,16.1-23.2"
                      , stroke color
                      , strokeWidth "6"
                      , strokeLinecap "round"
                      , strokeMiterlimit "6"
                      , fill "none" ] [ ]
          , Svg.path  [ d "M65.4,65.2c0,1.8-1.4,3.2-3.2,3.2l0,0c-1.8,0-3.2-1.4-3.2-3.2V36.1c0-1.8,1.4-3.2,3.2-3.2l0,0 c1.8,0,3.2,1.4,3.2,3.2V65.2z"
                      , fill color ] [ ] ]

brightnessSetupIcon : Svg msg
brightnessSetupIcon =
  let containerWidth = 176
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.circle  [ cx "89.3"
                        , cy "64.4"
                        , r "10.4"
                        , fill "#FFD400"] [ ]
          , Svg.path  [ d "M91.4,49.4c0,1.2-0.9,2.1-2.1,2.1l0,0c-1.2,0-2.1-0.9-2.1-2.1V38.8c0-1.2,0.9-2.1,2.1-2.1l0,0 c1.2,0,2.1,0.9,2.1,2.1V49.4z"
                      , fill "#FFD400" ] [ ]
          , Svg.path  [ d "M80.1,52.2c0.8,0.8,0.8,2.2,0,3l0,0c-0.8,0.8-2.2,0.8-3,0l-7.5-7.5c-0.8-0.8-0.8-2.2,0-3l0,0 c0.8-0.8,2.2-0.8,3,0L80.1,52.2z"
                      , fill "#FFD400" ] [ ]
          , Svg.path  [ d "M74.1,62.2c1.2,0,2.1,0.9,2.1,2.1l0,0c0,1.2-0.9,2.1-2.1,2.1H63.5c-1.2,0-2.1-0.9-2.1-2.1l0,0 c0-1.2,0.9-2.1,2.1-2.1H74.1z"
                      , fill "#FFD400" ] [ ]
          , Svg.path  [ d "M76.9,73.6c0.8-0.8,2.2-0.8,3,0l0,0c0.8,0.8,0.8,2.2,0,3L72.4,84c-0.8,0.8-2.2,0.8-3,0l0,0 c-0.8-0.8-0.8-2.2,0-3L76.9,73.6z"
                      , fill "#FFD400" ] [ ]
          , Svg.path  [ d "M86.9,79.6c0-1.2,0.9-2.1,2.1-2.1l0,0c1.2,0,2.1,0.9,2.1,2.1v10.6c0,1.2-0.9,2.1-2.1,2.1l0,0 c-1.2,0-2.1-0.9-2.1-2.1V79.6z"
                      , fill "#FFD400" ] [ ]
          , Svg.path  [ d "M98.2,76.7c-0.8-0.8-0.8-2.2,0-3l0,0c0.8-0.8,2.2-0.8,3,0l7.5,7.5c0.8,0.8,0.8,2.2,0,3l0,0 c-0.8,0.8-2.2,0.8-3,0L98.2,76.7z"
                      , fill "#FFD400" ] [ ]
          , Svg.path  [ d "M104.2,66.7c-1.2,0-2.1-0.9-2.1-2.1l0,0c0-1.2,0.9-2.1,2.1-2.1h10.6c1.2,0,2.1,0.9,2.1,2.1l0,0 c0,1.2-0.9,2.1-2.1,2.1H104.2z"
                      , fill "#FFD400" ] [ ]
          , Svg.path  [ d "M101.4,55.4c-0.8,0.8-2.2,0.8-3,0l0,0c-0.8-0.8-0.8-2.2,0-3l7.5-7.5c0.8-0.8,2.2-0.8,3,0l0,0 c0.8,0.8,0.8,2.2,0,3L101.4,55.4z"
                      , fill "#FFD400" ] [ ]
          , Svg.path  [ d "M48.3,63.9c0-16.2,10.9-29.9,25.8-34.1V8.2C69,3,60.6,3,55.4,8.2L9.5,54.1c-5.2,5.2-5.2,13.6,0,18.7 l45.9,45.9c5.2,5.2,13.6,5.2,18.7,0V97.9C59.2,93.8,48.3,80.1,48.3,63.9z"
                      , fill "#D1D3D4"] [ ]
          , Svg.text' [ transform "matrix(1 0 0 1 19.3679 71.0002)"
                      , fontFamily "HelveticaNeue-Bold"
                      , fontSize "28px" ] [ text "-" ]
          , Svg.path  [ d "M129.5,63.9c0-16.2-10.9-29.9-25.8-34.1V8.2c5.2-5.2,13.6-5.2,18.7,0l45.9,45.9c5.2,5.2,5.2,13.6,0,18.7 l-45.9,45.9c-5.2,5.2-13.6,5.2-18.7,0V97.9C118.5,93.8,129.5,80.1,129.5,63.9z"
                      , fill "#D1D3D4"] [ ]
          , Svg.text' [ transform "matrix(1 0 0 1 142.5398 71.0002)"
                      , fontFamily "HelveticaNeue-Bold"
                      , fontSize "24px" ] [ text "+" ]
          ]
incrementIcon : Svg msg
incrementIcon =
  let containerWidth = 180
      containerHeight = 300
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M8.1,289.2v-51.8c0,0,71.3-19.2,67-87.6c-3.8-60.9-67-85.3-67-85.3V13.9c0,0,26.5-17.5,45.7,0 s112.7,101.7,118.8,120c6.1,18.3,5.7,17.1,0,34.3C166.9,185.3,66.4,277,47,290.4C22.6,301.8,8.1,289.2,8.1,289.2z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.text' [ transform "matrix(1 0 0 1 86 180)"
                      , fontFamily "Arial-BoldMT"
                      , fill "#414042"
                      , fontSize "110px" ] [ text "+" ] ]

brightnessIcon : Svg msg
brightnessIcon =
  let containerWidth = 180
      containerHeight = 300
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.circle  [ cx "89"
                        , cy "147"
                        , r "24.5"
                        , fill "#FFFF0B" ]
                        [ ]
          , brightnessLine "89" "80.6" "89" "113.3"
          , brightnessLine "116.4" "122.9" "137.7" "101.2"
          , brightnessLine "123.3" "149.7" "152.2" "149.7"
          , brightnessLine "113.4" "174.3" "133.2" "194.8"
          , brightnessLine "89" "181.1" "89" "213.1"
          , brightnessLine "64.6" "174.3" "41" "194.8"
          , brightnessLine "52.8" "149.7" "22.7" "149.7"
          , brightnessLine "62" "120.1" "41" "97.7" ]

brightnessLine : String -> String -> String -> String -> Svg msg
brightnessLine x1' y1' x2' y2' =
  Svg.line  [ x1 x1'
            , y1 y1'
            , x2 x2'
            , y2 y2'
            , cx "89"
            , cy "148"
            , r "24.5"
            , stroke "#FFFF00"
            , strokeWidth "10"
            , strokeMiterlimit "10" ] [ ]

decrementIcon : Svg msg
decrementIcon =
  let containerWidth = 180
      containerHeight = 300
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M171.1,11.3v51.8c0,0-71.3,19.2-67,87.6c3.8,60.9,67,85.3,67,85.3v50.6c0,0-26.5,17.5-45.7,0 S12.7,184.9,6.6,166.6s-5.7-17.1,0-34.3S112.8,23.5,132.2,10.1C156.6-1.3,171.1,11.3,171.1,11.3z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.text' [ transform "matrix(1 0 0 1 30 180)"
                      , fontFamily "Arial-BoldMT"
                      , fill "#414042"
                      , fontSize "110px" ] [ text "-" ] ]



nightModeIcon : Svg msg
nightModeIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M125.3,106.6c0,9.7-7.9,17.6-17.6,17.6H21.4c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ] [ ]
          , Svg.path  [ d "M65.3,30.7c-1.3-0.6-2.6-1-3.9-1.4c7.4,11.3,9.4,25,4,37c-4.9,11-14.9,18.4-26.8,21.2c0.4,0.2,0.8,0.4,1.2,0.6 c15.8,7,34.4-0.1,41.4-15.9C88.2,56.3,81.1,37.7,65.3,30.7z"
                      , fill "#414042" ] [ ] ]

pipMenuIcon : Svg msg
pipMenuIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M125,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ] [ ]
          , Svg.path  [ d "M103.6,30.7c0,9.5,0,18.9,0,28.5c-12.4,0-24.5,0-37,0c0-9.4,0-18.8,0-28.5C78.8,30.7,91,30.7,103.6,30.7z M98.2,53.9c0-6.3,0-12.1,0-17.9c-9,0-17.7,0-26.3,0c0,6.2,0,12,0,17.9C80.7,53.9,89.3,53.9,98.2,53.9z"
                      , fill "#6D2B90" ] [ ]
          , Svg.path  [ d "M30.9,85.3c16.9,0,41.8,0,60.5,0c0-7.2,0-14.2,0-21.5c1.8,0,3.3,0,5.1,0c0,8.8,0,17.6,0,26.7 c-23.5,0-47,0-71,0c0-16.9,0-50.4,0-50.4h34.9l0,4.9H30.9v36.3"
                      , fill "#6D2B90" ] [ ] ]

monitorIcon : String -> Bool -> Svg msg
monitorIcon label isSelected =
  let containerWidth = 160
      containerHeight = 140
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M161,131.4c0,3-1.8,5.5-4.1,5.5H4.1c-2.2,0-4.1-2.5-4.1-5.5V5.5C0,2.5,1.8,0,4.1,0h152.9c2.2,0,4.1,2.5,4.1,5.5V131.4z"
                      , fill "#000" ] [ ]
          , Svg.path  [ d "M153.3,115.8c0,1-0.6,1.8-1.4,1.8H9c-0.7,0-1.4-0.8-1.4-1.8V10.7c0-1,0.6-1.8,1.4-1.8H152c0.7,0,1.4,0.8,1.4,1.8V115.8z"
                      , fill (if isSelected then "#34b3c7" else "#cbccce") ] [ ]
          , Svg.ellipse [ fill "#848689"
                        , cx "123.6"
                        , cy "126.4"
                        , rx "3.6"
                        , ry "3.5" ] [ ]
          , Svg.ellipse [ fill "#848689"
                        , cx "135.9"
                        , cy "126.4"
                        , rx "3.6"
                        , ry "3.5" ] [ ]
          , Svg.ellipse [ fill "#848689"
                        , cx "148.2"
                        , cy "126.4"
                        , rx "3.6"
                        , ry "3.5" ] [ ]
          , Svg.text'   [ transform "matrix(1 0 0 1 80 90)"
                        , fontFamily "Arial-Black"
                        , textAnchor "middle"
                        , fontSize "80px" ] [ text label ] ]

lockIcon : Svg msg
lockIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "110%"
          , width "110%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M36.6,66.4c0,0,3.5-1.7,6.8,1.2l5.3,7.7c1.1,0.3,2.1-0.2,2.8-1.1V37.4c0-1.4,1.3-3.4,2.8-3.4h1.4c1.6,0,2.8,2,2.8,3.4v22.5c2,1.8,3,0.4,3.3-0.8V32c0-1.4,1.3-3.4,2.8-3.4h1.4c1.6,0,2.8,2,2.8,3.4v26.2c1.4,1.8,2.8,0.8,3.3,0.3V34.9c0-1.4,1.3-3.4,2.8-3.4h1.4c1.6,0,2.8,2,2.8,3.4v25.8c0.1,0.1,0.2,0.3,0.2,0.4c0.9,2,2.5,0.7,3.1,0.1V43.9c0-1.4,1.3-3.4,2.8-3.4h1.4c1.6,0,2.8,2,2.8,3.4v21.6c2.3,14.5,2.1,33.2-18.3,33.2c-21.8,0-24.6-7-26-11.5c-0.8-2.6-2-5.1-2.9-6.7l-6.1-10.3C35.1,69.2,35.3,67.4,36.6,66.4z"
                      , fill "#BCBEC0" ] [ ] ]



presetIcon : Svg msg
presetIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "130%"
          , width "130%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M99.2,45.8c0,2.8-2.3,5.1-5.1,5.1H48.1c-2.8,0-5.1-2.3-5.1-5.1l0,0c0-2.8,2.3-5.1,5.1-5.1h46.1C97,40.6,99.2,42.9,99.2,45.8L99.2,45.8z"
                      , fill "#BCBEC0" ] [ ]
          , Svg.circle  [ cx "33.5"
                        , cy "45.7"
                        , r "4.9"
                        , fill "#BCBEC0" ] [ ]
          , Svg.path  [ d "M99.2,64.5c0,2.8-2.3,5.1-5.1,5.1H48.1c-2.8,0-5.1-2.3-5.1-5.1l0,0c0-2.8,2.3-5.1,5.1-5.1h46.1C97,59.3,99.2,61.6,99.2,64.5L99.2,64.5z"
                      , fill "#BCBEC0" ] [ ]
          , Svg.circle  [ cx "33.5"
                        , cy "64.4"
                        , r "4.9"
                        , fill "#BCBEC0" ] [ ]
          , Svg.path  [ d "M99.2,83.2c0,2.8-2.3,5.1-5.1,5.1H48.1c-2.8,0-5.1-2.3-5.1-5.1l0,0c0-2.8,2.3-5.1,5.1-5.1h46.1C97,78.1,99.2,80.3,99.2,83.2L99.2,83.2z"
                      , fill "#BCBEC0" ] [ ]
          , Svg.circle  [ cx "33.5"
                        , cy "83.1"
                        , r "4.9"
                        , fill "#BCBEC0"  ] [ ] ]

menuIcon : Svg msg
menuIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M14.43,72.7l3.44,12a1.68,1.68,0,0,0,1.87,1.2l11-2a39,39,0,0,0,7.93,10L34.17,104a1.69,1.69,0,0,0,0,1.19,1.67,1.67,0,0,0,.77.9l10.89,6a1.68,1.68,0,0,0,2.17-.48l6.32-9.2a39,39,0,0,0,12.66,1.44L71,114.31a1.67,1.67,0,0,0,2,.95l12-3.43A1.67,1.67,0,0,0,86.2,110l-2-11a39.15,39.15,0,0,0,10-7.93l10.23,4.46a1.68,1.68,0,0,0,2.09-.74l6-10.89a1.7,1.7,0,0,0-.48-2.17l-9.21-6.32a39,39,0,0,0,1.44-12.66l10.39-4.08a1.68,1.68,0,0,0,.95-2l-3.43-12a1.67,1.67,0,0,0-1.87-1.2l-11,2a39.08,39.08,0,0,0-7.93-10l4.46-10.23a1.68,1.68,0,0,0,0-1.19,1.66,1.66,0,0,0-.77-0.9l-10.88-6a1.68,1.68,0,0,0-2.17.48l-6.32,9.2a39.05,39.05,0,0,0-12.66-1.44L59,15a1.66,1.66,0,0,0-.82-0.86A1.64,1.64,0,0,0,57,14.1L45,17.53a1.64,1.64,0,0,0-1,.7,1.68,1.68,0,0,0-.25,1.16l2,11a39,39,0,0,0-10,7.93L25.66,33.84a1.67,1.67,0,0,0-2.09.75l-6,10.88a1.73,1.73,0,0,0-.17,1.18,1.7,1.7,0,0,0,.65,1L27.21,54a39,39,0,0,0-1.45,12.66L15.38,70.7a1.65,1.65,0,0,0-.86.82A1.69,1.69,0,0,0,14.43,72.7Zm29.11-1.87A22.34,22.34,0,1,1,71.17,86.15,22.34,22.34,0,0,1,43.54,70.83Z"
                      , transform "translate(14 14) scale(0.8)"
                      , fill "#BCBEC0" ] [ ] ]

systemPreferencesIconHeader : Svg msg
systemPreferencesIconHeader =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M14.43,72.7l3.44,12a1.68,1.68,0,0,0,1.87,1.2l11-2a39,39,0,0,0,7.93,10L34.17,104a1.69,1.69,0,0,0,0,1.19,1.67,1.67,0,0,0,.77.9l10.89,6a1.68,1.68,0,0,0,2.17-.48l6.32-9.2a39,39,0,0,0,12.66,1.44L71,114.31a1.67,1.67,0,0,0,2,.95l12-3.43A1.67,1.67,0,0,0,86.2,110l-2-11a39.15,39.15,0,0,0,10-7.93l10.23,4.46a1.68,1.68,0,0,0,2.09-.74l6-10.89a1.7,1.7,0,0,0-.48-2.17l-9.21-6.32a39,39,0,0,0,1.44-12.66l10.39-4.08a1.68,1.68,0,0,0,.95-2l-3.43-12a1.67,1.67,0,0,0-1.87-1.2l-11,2a39.08,39.08,0,0,0-7.93-10l4.46-10.23a1.68,1.68,0,0,0,0-1.19,1.66,1.66,0,0,0-.77-0.9l-10.88-6a1.68,1.68,0,0,0-2.17.48l-6.32,9.2a39.05,39.05,0,0,0-12.66-1.44L59,15a1.66,1.66,0,0,0-.82-0.86A1.64,1.64,0,0,0,57,14.1L45,17.53a1.64,1.64,0,0,0-1,.7,1.68,1.68,0,0,0-.25,1.16l2,11a39,39,0,0,0-10,7.93L25.66,33.84a1.67,1.67,0,0,0-2.09.75l-6,10.88a1.73,1.73,0,0,0-.17,1.18,1.7,1.7,0,0,0,.65,1L27.21,54a39,39,0,0,0-1.45,12.66L15.38,70.7a1.65,1.65,0,0,0-.86.82A1.69,1.69,0,0,0,14.43,72.7Zm29.11-1.87A22.34,22.34,0,1,1,71.17,86.15,22.34,22.34,0,0,1,43.54,70.83Z"
                      , transform "translate(14 14) scale(0.8)"
                      , fill "#FFF" ] [ ] ]


informationIcon : Svg msg
informationIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M66.7,103.1c-21.3,0-38.7-17.3-38.7-38.7s17.3-38.7,38.7-38.7s38.7,17.3,38.7,38.7S88,103.1,66.7,103.1zM66.7,34.4c-16.6,0-30.1,13.5-30.1,30.1s13.5,30.1,30.1,30.1S96.8,81,96.8,64.5S83.3,34.4,66.7,34.4"
                      , fill "#BCBEC0" ] [ ]
          , Svg.path  [ d "M71.2,85c0,2.5-2,4.4-4.4,4.4l0,0c-2.5,0-4.4-2-4.4-4.4V59.5c0-2.5,2-4.4,4.4-4.4l0,0c2.5,0,4.4,2,4.4,4.4V85z"
                      , fill "#BCBEC0" ] [ ]
          , Svg.circle [ cx "66.7"
                        , cy "46.5"
                        , r "5.8"
                        , fill "#BCBEC0" ] [ ] ]

pipButtonIcon : Svg msg
pipButtonIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M104.3,33.2c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C78.6,33.2,91.3,33.2,104.3,33.2zM98.7,57.4c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C80.6,57.4,89.4,57.4,98.7,57.4z"
                      , fill "#6D2B90" ] [ ]
          , Svg.path  [ d "M28.9,89.8c17.5,0,43.3,0,62.8,0c0-7.5,0-14.7,0-22.3c1.9,0,3.4,0,5.2,0c0,9.1,0,18.2,0,27.7c-24.4,0-48.7,0-73.6,0c0-17.5,0-52.3,0-52.3h36.2l0,5H29v37.6"
                      , fill "#6D2B90" ] [ ] ]

pipIcon : Svg msg
pipIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.path  [ d "M104.3,33.2c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C78.6,33.2,91.3,33.2,104.3,33.2zM98.7,57.4c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C80.6,57.4,89.4,57.4,98.7,57.4z"
                      , fill "#3C2F90" ] [ ]
          , Svg.path  [ d "M28.9,89.8c17.5,0,43.3,0,62.8,0c0-7.5,0-14.7,0-22.3c1.9,0,3.4,0,5.2,0c0,9.1,0,18.2,0,27.7c-24.4,0-48.7,0-73.6,0c0-17.5,0-52.3,0-52.3h36.2l0,5H29v37.6"
                      , fill "#3C2F90" ] [ ]
          , Svg.path  [ d "M32.2,72.5l1.1,3.8c0,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.2,0.1,0.4,0.1l3.5-0.7c0.7,1.2,1.5,2.3,2.5,3.2l-1.4,3.3c0,0.1-0.1,0.3,0,0.4c0,0.1,0.1,0.2,0.2,0.3l3.5,1.9c0.1,0.1,0.2,0.1,0.4,0.1c0.1,0,0.2-0.1,0.3-0.2l2-2.9c1.3,0.4,2.7,0.5,4,0.5l1.3,3.3c0,0.1,0.1,0.2,0.3,0.3c0.1,0.1,0.3,0.1,0.4,0l3.8-1.1c0.1,0,0.2-0.1,0.3-0.2c0.1-0.1,0.1-0.2,0.1-0.4l-0.7-3.5c1.2-0.7,2.3-1.5,3.2-2.5l3.3,1.4c0.1,0,0.3,0.1,0.4,0c0.1,0,0.2-0.1,0.3-0.2l1.9-3.5c0.1-0.1,0.1-0.2,0.1-0.4c0-0.1-0.1-0.2-0.2-0.3l-2.9-2c0.4-1.3,0.5-2.7,0.5-4l3.3-1.3c0.1-0.1,0.2-0.1,0.3-0.3c0.1-0.1,0.1-0.3,0-0.4l-1.1-3.8c0-0.1-0.1-0.2-0.2-0.3c-0.1-0.1-0.2-0.1-0.4-0.1l-3.5,0.7c-0.7-1.2-1.5-2.3-2.5-3.2l1.4-3.3c0-0.1,0.1-0.3,0-0.4c0-0.1-0.1-0.2-0.2-0.3l-3.5-1.9c-0.1-0.1-0.2-0.1-0.4-0.1c-0.1,0-0.2,0.1-0.3,0.2l-2,2.9c-1.3-0.4-2.7-0.5-4-0.5l-1.3-3.3c0-0.1-0.1-0.2-0.3-0.3c-0.1-0.1-0.3-0.1-0.4,0L42,54.9c-0.1,0-0.2,0.1-0.3,0.2c-0.1,0.1-0.1,0.2-0.1,0.4l0.7,3.5c-1.2,0.7-2.3,1.5-3.2,2.5l-3.3-1.4c-0.1,0-0.3-0.1-0.4,0c-0.1,0-0.2,0.1-0.3,0.2l-1.9,3.5c-0.1,0.1-0.1,0.2-0.1,0.4c0,0.1,0.1,0.2,0.2,0.3l2.9,2c-0.4,1.3-0.5,2.7-0.5,4l-3.3,1.3c-0.1,0-0.2,0.1-0.3,0.3C32.2,72.3,32.2,72.4,32.2,72.5z M41.5,71.9c-1.1-3.8,1.1-7.7,4.9-8.8c3.8-1.1,7.7,1.1,8.8,4.9c1.1,3.8-1.1,7.7-4.9,8.8C46.5,77.9,42.6,75.7,41.5,71.9z"
                      , fill "#3C2F90"] [ ] ]

osdIcon : Svg msg
osdIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.path  [ d "M49.8,67.3l1.1,3.7c0,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.2,0.1,0.4,0.1l3.4-0.6c0.6,1.2,1.5,2.2,2.4,3.1l-1.4,3.1 c0,0.1-0.1,0.2,0,0.4c0,0.1,0.1,0.2,0.2,0.3l3.3,1.8c0.1,0.1,0.2,0.1,0.4,0.1c0.1,0,0.2-0.1,0.3-0.2l1.9-2.8 c1.2,0.4,2.5,0.5,3.9,0.4l1.2,3.2c0,0.1,0.1,0.2,0.3,0.3c0.1,0.1,0.2,0.1,0.4,0l3.7-1.1c0.1,0,0.2-0.1,0.3-0.2 c0.1-0.1,0.1-0.2,0.1-0.4l-0.6-3.4c1.2-0.6,2.2-1.5,3.1-2.4l3.1,1.4c0.1,0,0.2,0.1,0.4,0c0.1,0,0.2-0.1,0.3-0.2l1.8-3.3 c0.1-0.1,0.1-0.2,0.1-0.4c0-0.1-0.1-0.2-0.2-0.3l-2.8-1.9c0.4-1.2,0.5-2.5,0.4-3.9l3.2-1.2c0.1,0,0.2-0.1,0.3-0.3 c0.1-0.1,0.1-0.2,0-0.4l-1.1-3.7c0-0.1-0.1-0.2-0.2-0.3c-0.1-0.1-0.2-0.1-0.4-0.1l-3.4,0.6c-0.6-1.2-1.5-2.2-2.4-3.1l1.4-3.1 c0-0.1,0.1-0.2,0-0.4c0-0.1-0.1-0.2-0.2-0.3l-3.3-1.8c-0.1-0.1-0.2-0.1-0.4-0.1c-0.1,0-0.2,0.1-0.3,0.2l-1.9,2.8 c-1.2-0.4-2.5-0.5-3.9-0.4l-1.3-3.2c0-0.1-0.1-0.2-0.3-0.3c-0.1-0.1-0.2-0.1-0.4,0l-3.7,1c-0.1,0-0.2,0.1-0.3,0.2 c-0.1,0.1-0.1,0.2-0.1,0.4l0.6,3.4c-1.2,0.6-2.2,1.5-3.1,2.4l-3.1-1.4c-0.1,0-0.2-0.1-0.4,0c-0.1,0-0.2,0.1-0.3,0.2l-1.8,3.3 c-0.1,0.1-0.1,0.2-0.1,0.4c0,0.1,0.1,0.2,0.2,0.3l2.8,1.9c-0.4,1.2-0.5,2.5-0.4,3.9l-3.2,1.3c-0.1,0-0.2,0.1-0.3,0.3 C49.8,67,49.8,67.1,49.8,67.3z M58.7,66.7c-1-3.6,1.1-7.4,4.7-8.5c3.6-1,7.4,1.1,8.5,4.7c1,3.6-1.1,7.4-4.7,8.5 C63.5,72.4,59.8,70.3,58.7,66.7z"
                      , fill "#0290AB" ] [ ]
          , Svg.path  [ d "M102.2,92H27.6V36.6h74.7V92z M33.6,86h62.7V42.6H33.6V86z"
                      , fill "#0290AB" ] [ ] ]

leftRightIcon : Bool -> Svg msg
leftRightIcon isOn =
  let containerWidth = 128
      containerHeight = 128
      iconColor = if isOn then "#00747d" else "#58595b"
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.rect  [ x "30.5"
                      , y "40.7"
                      , width "52.2"
                      , height "8.4"
                      , fill iconColor ] [ ]
          , Svg.polygon [ points  "21.5,44.9 43.1,23.3 48.1,28.5 31.9,44.7 48.4,61.2 43.2,66.4"
                        , fill iconColor ] [ ]
          , Svg.rect  [ x "45.5"
                      , y "78.7"
                      , width "52.2"
                      , height "8.4"
                      , fill iconColor ] [ ]
          , Svg.polygon [ points  "106.7,82.8 85.1,104.4 80.2,99.2 96.3,83 79.8,66.5 85,61.3"
                        , fill iconColor ] [ ] ]

upDownIcon : Bool -> Svg msg
upDownIcon isOn =
  let containerWidth = 128
      containerHeight = 128
      iconColor = if isOn then "#0069af" else "#58595b"
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.rect  [ x "40.6"
                      , y "30.3"
                      , width "8.4"
                      , height "52.4"
                      , fill iconColor ] [ ]
          , Svg.polygon [ points  "44.8,21.2 23.2,42.9 28.4,47.8 44.6,31.6 61.1,48.2 66.3,43"
                        , fill iconColor ] [ ]
          , Svg.rect  [ x "78.6"
                      , y "45.2"
                      , width "8.4"
                      , height "52.2"
                      , fill iconColor ] [ ]
          , Svg.polygon [ points  "82.7,106.5 104.3,84.8 99.1,79.9 83,96.1 66.4,79.5 61.2,84.7"
                        , fill iconColor ] [ ] ]

resizeIcon : Bool -> Svg msg
resizeIcon isOn =
  let containerWidth = 128
      containerHeight = 128
      iconColor = if isOn then "#21409A" else "#58595b"
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.path  [ d "M24.4,95.1c0-17.5,0-34.7,0-52.3c11.9,0,23.7,0,35.9,0c0.1,1.5,0.2,3,0.3,5c-10.2,0-30.5,0-30.5,0v37.6l17.7-17.1H35l-0.3-5.3c0,0,14.4,0,21.9,0c0,6.9,0,14,0,21.6c-1.4,0.1-2.9,0.2-5,0.3c0-3.8,0-12.9,0-12.9S38.6,85,34.2,89.8c17.5,0,39.1,0,58.5,0c0-7.5,0-14.7,0-22.3c1.9,0,3.4,0,5.2,0c0,9.1,0,18.2,0,27.7C73.6,95.1,49.2,95.1,24.4,95.1z"
                      , fill iconColor ] [ ]
          , Svg.path  [ d "M103.3,33.1c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C77.6,33.1,90.4,33.1,103.3,33.1zM97.8,57.3c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C79.7,57.3,88.5,57.3,97.8,57.3z"
                      , fill iconColor ] [ ] ]

exitPipIcon : Svg msg
exitPipIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.path  [ d "M106.8,28.2c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C81.1,28.2,93.8,28.2,106.8,28.2zM101.2,52.4c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C83.1,52.4,91.9,52.4,101.2,52.4z"
                      , fill "#6D2B90" ] [ ]
          , Svg.path  [ d "M31.4,84.8c17.5,0,43.3,0,62.8,0c0-7.5,0-14.7,0-22.3c1.9,0,3.4,0,5.2,0c0,9.1,0,18.2,0,27.7c-24.4,0-48.7,0-73.6,0c0-17.5,0-52.3,0-52.3H62l0,5H31.5v37.6"
                      , fill "#6D2B90" ] [ ]
          , Svg.rect  [ x "4.9"
                      , y "61"
                      , transform "matrix(0.7071 -0.7071 0.7071 0.7071 -26.598 64.3651)"
                      , width "119"
                      , height "5.5"
                      , fill "#6D2B90" ] [ ]
          , Svg.rect  [ x "4.9"
                      , y "61"
                      , transform "matrix(-0.7071 -0.7071 0.7071 -0.7071 64.4724 155.2838)"
                      , width "119"
                      , height "5.5"
                      , fill "#6D2B90" ] [ ] ]

selectIcon : Bool -> Svg msg
selectIcon isOn =
  let containerWidth = 128
      containerHeight = 128
      iconColor = if isOn then "#129848" else "#58595b"
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.polygon   [ points "52.6,95.9 31.2,75.3 36.2,62.3 51.7,82.6 83.9,32.2 95.7,41.3"
                          , fill iconColor ] [ ] ]

monitorCountIcon : Svg msg
monitorCountIcon =
  let containerWidth = 256
      containerHeight = 256
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.path  [ d "M217.3,58.5H40.6c-2.6,0-4.7,2.9-4.7,6.4v145.5c0,3.5,2.2,6.4,4.7,6.4h176.7c2.6,0,4.7-2.9,4.7-6.4V64.8 C222,61.3,219.9,58.5,217.3,58.5z M178.7,208.6c-2.2-0.1-3.9-2-3.8-4.2c0.1-2.2,2-3.9,4.2-3.8c2.1,0.1,3.8,1.9,3.8,4 C182.9,206.8,181.1,208.6,178.7,208.6C178.8,208.6,178.8,208.6,178.7,208.6z M192.9,208.6c-2.2-0.1-4-1.9-3.9-4.1
                          c0.1-2.2,1.9-4,4.1-3.9c2.2,0.1,3.9,1.8,3.9,4C197,206.8,195.2,208.6,192.9,208.6z M207.1,208.6c-2.2-0.1-4-1.9-3.9-4.1
                          c0.1-2.2,1.9-4,4.1-3.9c2.2,0.1,3.9,1.8,3.9,4C211.2,206.8,209.4,208.6,207.1,208.6C207.1,208.6,207.1,208.6,207.1,208.6
                          L207.1,208.6z M213.1,192.3c0.2,1-0.5,2-1.5,2.2c0,0,0,0,0,0H46.3c-1-0.2-1.7-1.1-1.6-2.2c0,0,0,0,0,0V70.8c-0.2-1,0.5-2,1.5-2.2
                          c0,0,0,0,0,0h165.2c1,0.2,1.7,1.1,1.6,2.2c0,0,0,0,0,0L213.1,192.3L213.1,192.3z",
                        fill "#065A6B" ] [ ]
          , Svg.text'  [ transform "matrix(1.2 0 0 1 95.7905 163.7627)"
                      , fill "#065A6B"
                      , fontFamily "HelveticaNeue-Bold"
                      , fontSize "95px" ] [ text "#" ] ]

themeIcon : Svg msg
themeIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M125,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ] [ ]
          , Svg.ellipse [ transform "matrix(0.7707 -0.6372 0.6372 0.7707 -13.9444 62.9444)"
                        , cx "80.5"
                        , cy "50.8"
                        , rx "6.3"
                        , ry "23.5"
                        , fill "none"
                        , stroke "#3C2F90"
                        , strokeWidth "4"
                        , strokeMiterlimit "10" ] []
          , Svg.path  [ d "M55.8,102.5C53,104.8,44,98.6,35.7,88.6s-12.7-20-9.9-22.4l32.6-27c0,0,1.5,8.9,11.4,20.8s18.7,15.5,18.7,15.5L55.8,102.5z"
                      , fill "none"
                      , stroke "#3C2F90"
                      , strokeWidth "4"
                      , strokeMiterlimit "10" ] []
          , Svg.path  [ d "M85.6,62.3c0,0,5.8,4.8,9.2,8.3s4.8,16.2,2.7,20.8c-2.2,4.7-0.1,9,2.9,9.4c2.9,0.4,4.7-1.3,5.4-6.2c0.7-4.9,0.9-19.3-13.9-30.5"
                      , fill "#3C2F90"] [ ]
          , Svg.path  [ d "M52.1,67.2c0-0.1-4.5-6.7-8.6-14.5c-5.7-10.7-8.1-18.5-7.2-23.1c0.4-1.9,1.3-3.3,2.7-4.2c3.9-2.5,9.1,0.4,19.9,11.5l-2.6,2.6c-10.4-10.5-14-11.8-15.3-11c-0.3,0.2-0.8,0.7-1.1,1.8C38.4,38,50.4,58.1,55.2,65.2c0,0,0.4,1.6-0.4,2.3S52.1,67.2,52.1,67.2z"
                      , fill "#3C2F90"] [ ]
          , Svg.path  [ d "M76.4,54.2L92,57.4c0,0,4.5,7.1,4.3,8.6c-0.2,1.5-1.7,5.6-5,3.7c-3.4-1.9-9.1-6.3-9.9-8c-0.7-1.7-5.8-6.8-5.8-6.8"
                      , fill "#3C2F90"] [ ] ]

-- themeLibrary =  { defaultBackgroundStyle = ("background", "-webkit-linear-gradient(-90deg, #005fa9, #00417a)")
--                 , defaultBackgroundFlatStyle = ("background", "#005fa9")
--                 , defaultBackgroundNavStyle = ("background", "#003169")
--                 , darkBackgroundStyle = ("background", "-webkit-linear-gradient(-90deg, #a1a2a6, #4c4c4e)")
--                 , darkBackgroundFlatStyle = ("background", "#a1a2a6")
--                 , darkBackgroundNavStyle = ("background", "#4c4c4e")
--                 }

defaultThemeIcon : Svg msg
defaultThemeIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ linearGradient  [ id "SVGID_1_"
                            , gradientUnits "userSpaceOnUse"]
                            [ stop  [ offset "0"
                                    , stopColor "#005fa9" ] [ ]
                            , stop  [ offset "1"
                                    , stopColor "#00417a" ] [ ] ]
          , Svg.rect  [ x "10"
                      , y "10"
                      , width "108.8"
                      , height "108.8"
                      , fill "url(#SVGID_1_)" ] [ ] ]

darkThemeIcon : Svg msg
darkThemeIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ linearGradient  [ id "SVGID_1_"
                            , gradientUnits "userSpaceOnUse"]
                            [ stop  [ offset "0"
                                    , stopColor "#a1a2a6" ] [ ]
                            , stop  [ offset "1"
                                    , stopColor "#4c4c4e" ] [ ] ]
          , Svg.rect  [ x "10"
                      , y "10"
                      , width "108.8"
                      , height "108.8"
                      , fill "url(#SVGID_1_)" ] [ ] ]

-- <?xml version="1.0" encoding="utf-8"?>
-- <!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
-- <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
-- 	 viewBox="0 0 128 128" style="enable-background:new 0 0 128 128;" xml:space="preserve">
-- <style type="text/css">
-- 	.st0{fill:#ED1C24;}
-- </style>
-- <rect x="10" y="10.5" class="st0" width="108.8" height="108.8"/>
-- </svg>

defaultFlatThemeIcon : Svg msg
defaultFlatThemeIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.rect  [ x "10"
                      , y "10"
                      , width "108.8"
                      , height "108.8"
                      , fill "#005fa9" ] [ ] ]

darkFlatThemeIcon : Svg msg
darkFlatThemeIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.rect  [ x "10"
                      , y "10"
                      , width "108.8"
                      , height "108.8"
                      , fill "#a1a2a6" ] [ ] ]

exitOsdIcon : Svg msg
exitOsdIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.path  [ d "M106.8,28.2c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C81.1,28.2,93.8,28.2,106.8,28.2zM101.2,52.4c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C83.1,52.4,91.9,52.4,101.2,52.4z"
                      , fill "#0290AB" ] [ ]
          , Svg.path  [ d "M31.4,84.8c17.5,0,43.3,0,62.8,0c0-7.5,0-14.7,0-22.3c1.9,0,3.4,0,5.2,0c0,9.1,0,18.2,0,27.7c-24.4,0-48.7,0-73.6,0c0-17.5,0-52.3,0-52.3H62l0,5H31.5v37.6"
                      , fill "#0290AB" ] [ ]
          , Svg.rect  [ x "4.9"
                      , y "61"
                      , transform "matrix(0.7071 -0.7071 0.7071 0.7071 -26.598 64.3651)"
                      , width "119"
                      , height "5.5"
                      , fill "#0290AB" ] [ ]
          , Svg.rect  [ x "4.9"
                      , y "61"
                      , transform "matrix(-0.7071 -0.7071 0.7071 -0.7071 64.4724 155.2838)"
                      , width "119"
                      , height "5.5"
                      , fill "#0290AB" ] [ ] ]

leftIcon : Svg msg
leftIcon =
  let containerWidth = 256
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.rect  [ x "58.78"
                      , y "55.41"
                      , width "156.97"
                      , height "17.75"
                      , fill "#231f20" ] [ ]
          , Svg.polygon [ points "39.58 64.38 85.41 18.54 95.91 29.55 61.6 63.87 96.68 98.95 85.67 109.96 39.58 64.38"
                        , fill "#231f20" ] [ ] ]

rightIcon : Svg msg
rightIcon =
  let containerWidth = 256
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.rect  [ x "39.6"
                      , y "55.41"
                      , width "156.97"
                      , height "17.75"
                      , fill "#231f20" ] [ ]
          , Svg.polygon [ points "215.8,64.4 169.9,18.5 159.4,29.6 193.7,63.9 158.6,98.9 169.7,110"
                        , fill "#231f20" ] [ ] ]

closeIcon : Svg msg
closeIcon =
  let containerWidth = 256
      containerHeight = 256
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.text' [ x "0"
                      , y "240"
                      , fill "#fff"
                      , textAnchor "middle"
                      , fontFamily "Arial-Black"
                      , fontSize "240px" ] [ text "X" ] ]

labelIcon : String -> Svg msg
labelIcon value =
  let containerWidth = 256
      containerHeight = 256
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.text' [ x "128"
                      , y "240"
                      , fill "#fff"
                      , textAnchor "middle"
                      , fontFamily "Arial-Black"
                      , fontSize "240px" ] [ text value ] ]

labelLeftIcon : String -> Svg msg
labelLeftIcon value =
  let containerWidth = 256
      containerHeight = 256
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.text' [ x "0"
                      , y "240"
                      , fill "#fff"
                      , fontFamily "Arial-Black"
                      , fontSize "240px" ] [ text value ] ]

monitorSharpIcon : Svg msg
monitorSharpIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.path  [ d "M103.5,27.9H23.7c-1.2,0-2.1,1.3-2.1,2.9v65.7c0,1.6,1,2.9,2.1,2.9h79.8c1.2,0,2.1-1.3,2.1-2.9V30.8 C105.6,29.2,104.7,27.9,103.5,27.9z M86.1,95.7c-1,0-1.9-0.8-1.9-1.8c0-1,0.8-1.8,1.9-1.8c1,0,1.9,0.8,1.9,1.8 C88,94.9,87.1,95.7,86.1,95.7z M92.5,95.7c-1,0-1.9-0.8-1.9-1.8c0-1,0.8-1.8,1.9-1.8c1,0,1.9,0.8,1.9,1.8 C94.4,94.9,93.5,95.7,92.5,95.7z M98.9,95.7c-1,0-1.9-0.8-1.9-1.8c0-1,0.8-1.8,1.9-1.8c1,0,1.9,0.8,1.9,1.8 C100.8,94.9,100,95.7,98.9,95.7z M101.6,88.4c0,0.5-0.3,1-0.7,1H26.3c-0.4,0-0.7-0.4-0.7-1V33.5c0-0.5,0.3-1,0.7-1h74.6 c0.4,0,0.7,0.4,0.7,1V88.4z"
                      , fill "#00596A" ] [ ]
          , Svg.text' [ transform "matrix(1.2 0 0 1 48.6175 75.4754)"
                      , fill "#00596A"
                      , fontFamily "HelveticaNeue-Bold"
                      , fontSize "43px" ] [ text "#" ] ]

networkIcon : Svg msg
networkIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.circle  [ cx "64.5"
                        , cy "63.6"
                        , r "34.8"
                        , fill "none"
                        , stroke "#6D2B90"
                        , strokeWidth "4"
                        , strokeMiterlimit "10" ] [ ]
          , Svg.ellipse [ cx "64.5"
                        , cy "63.6"
                        , rx "19.8"
                        , ry "34.8"
                        , fill "none"
                        , stroke "#6D2B90"
                        , strokeWidth "4"
                        , strokeMiterlimit "10" ] [ ]
          , Svg.line  [ x1 "30"
                      , y1 "64"
                      , x2 "98.5"
                      , y2 "64"
                      , fill "none"
                      , stroke "#6D2B90"
                      , strokeWidth "4"
                      , strokeMiterlimit "10" ] [ ]
          , Svg.line  [ x1 "64.2"
                      , y1 "98.2"
                      , x2 "64.2"
                      , y2 "29.7"
                      , fill "none"
                      , stroke "#6D2B90"
                      , strokeWidth "4"
                      , strokeMiterlimit "10" ] [ ]
          , Svg.path  [ d "M99.4,63.6c0-11.2-5.3-21.1-13.5-27.5c-5.9,4.6-13.3,7.3-21.4,7.3S49,40.7,43.1,36.1 C35,42.5,29.7,52.4,29.7,63.6c0,10.8,4.9,20.5,12.7,26.9c6-5,13.8-8,22.2-8c8.4,0,16.2,3,22.2,8C94.4,84.1,99.4,74.4,99.4,63.6z"
                      , fill "none"
                      , stroke "#6D2B90"
                      , strokeWidth "4"
                      , strokeMiterlimit "10" ] [ ]
          , Svg.path  [ d "M42.3,90.5c6,5,13.8,8,22.2,8c8.4,0,16.2-3,22.2-8c-6-5-13.8-8-22.2-8C56.1,82.5,48.4,85.5,42.3,90.5z"
                      , fill "none"
                      , stroke "#6D2B90"
                      , strokeWidth "4"
                      , strokeMiterlimit "10" ] [ ]
          , Svg.path  [ d "M85.9,36.1c-5.9-4.6-13.3-7.3-21.4-7.3S49,31.5,43.1,36.1c5.9,4.6,13.3,7.3,21.4,7.3S80,40.7,85.9,36.1z"
                      , fill "none"
                      , stroke "#6D2B90"
                      , strokeWidth "4"
                      , strokeMiterlimit "10" ] [ ] ]

updateIcon : Svg msg
updateIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z"
                      , fill "#D1D3D4" ]
                      [ ]
          , Svg.path  [ d "M31.7,65.5h-6.1c0-21.7,17.7-39.4,39.4-39.4c9.3,0,18.4,3.3,25.5,9.4l-3.9,4.6c-6-5.1-13.7-7.9-21.6-7.9 C46.7,32.2,31.7,47.2,31.7,65.5z"
                      , fill "#0069AF" ] [ ]
          , Svg.path  [ d "M33.4,84.8"
                      , fill "#0069AF"
                      , stroke "#000000"
                      , strokeWidth "6"
                      , strokeMiterlimit "10" ] [ ]
          , Svg.polygon [ points "74.5,40.3 97,51.3 91.8,25.3"
                        , fill "#0069AF" ] [ ]
          , Svg.path  [ d "M63.7,102.3c-9.3,0-18.4-3.3-25.5-9.4l3.9-4.6c6,5.1,13.7,7.9,21.6,7.9C82,96.2,97,81.3,97,62.9h6.1 C103,84.6,85.4,102.3,63.7,102.3z"
                      , fill "#0069AF" ] [ ]
          , Svg.path  [ d "M94,43.2"
                      , fill "#0069AF"
                      , stroke "#000000"
                      , strokeWidth "6"
                      , strokeMiterlimit "10" ] [ ]
          , Svg.polygon [ points "52.7,87.1 30.2,76.2 35.4,102.1"
                        , fill "#0069AF" ] [ ] ]

saveIcon : Bool -> Svg msg
saveIcon isEnabled =
  let containerWidth = 116
      containerHeight = 116
      iconColor = if isEnabled then "#2968a1" else "#aaaaaa"
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M64.23,7.77A56.45,56.45,0,1,1,7.8,63.3,56.35,56.35,0,0,1,64.23,7.77ZM64.14,88.94h21c2.61,0,3.76-1.16,3.76-3.79q0-14.28,0-28.57a8.5,8.5,0,0,0-2.6-6.25q-4.1-4.09-8.19-8.19a8.61,8.61,0,0,0-6.36-2.62H43.33c-2.68,0-3.82,1.14-3.82,3.85q0,20.86,0,41.73c0,2.71,1.13,3.85,3.82,3.85H64.14Z"
                      , fill iconColor
                      , transform "translate(-6.6 -6.61)" ] [ ]
          , Svg.path  [ d "M64.14,88.94H43.33c-2.69,0-3.82-1.14-3.82-3.85q0-20.86,0-41.73c0-2.7,1.13-3.85,3.82-3.85H71.79a8.61,8.61,0,0,1,6.36,2.62q4.09,4.11,8.19,8.19a8.5,8.5,0,0,1,2.6,6.25q0,14.28,0,28.57c0,2.62-1.15,3.79-3.76,3.79h-21ZM43.68,64.17c0,5.85,0,11.7,0,17.55,0,1-.45,2.32.22,2.89s1.86,0.09,2.82.18,1.07-.22,1.06-1.06c0-3.94,0-7.87,0-11.81,0-2.41,1.17-3.6,3.58-3.6H77.11c2.39,0,3.55,1.2,3.55,3.62,0,3.26,0,6.52,0,9.78,0,1-.42,2.22.17,2.82s1.92,0.12,2.91.23c0.76,0.08,1-.16,1-1q0-13.66,0-27.33a4.34,4.34,0,0,0-1.34-3.22Q79.28,49.13,75.16,45a4.35,4.35,0,0,0-1.47-1c-1.09-.43-1.21-0.36-1.21.79q0,5.9,0,11.81A3.2,3.2,0,0,1,69,60.13H51.39c-2.43,0-3.6-1.17-3.61-3.57,0-3.34,0-6.67,0-10,0-.92.42-2.13-0.2-2.7s-1.8-.08-2.72-0.18-1.2.2-1.19,1.16C43.7,51.28,43.68,57.72,43.68,64.17Zm20.55,20.6c3.78,0,7.57,0,11.35,0,0.76,0,1-.18,1-1q-0.07-5.17,0-10.34c0-.81-0.25-1-1-1q-11.35,0-22.71,0c-0.76,0-1,.18-1,1q0.07,5.17,0,10.34c0,0.81.25,1,1,1C56.66,84.75,60.44,84.77,64.23,84.77Zm4.09-35c0-1.57,0-3.15,0-4.72A1.16,1.16,0,0,0,67,43.68q-2.75,0-5.51,0A1.16,1.16,0,0,0,60.13,45q0,4.78,0,9.56A1.16,1.16,0,0,0,61.46,56q2.75,0,5.51,0a1.16,1.16,0,0,0,1.35-1.36C68.29,53,68.31,51.39,68.31,49.78Z"
                      , fill "#fff"
                      , transform "translate(-6.6 -6.61)" ] [ ]
          , Svg.path  [ d "M43.68,64.17c0-6.45,0-12.9,0-19.34,0-1,.27-1.26,1.19-1.16s2.12-.37,2.72.18,0.19,1.78.2,2.7c0,3.34,0,6.67,0,10,0,2.4,1.18,3.57,3.61,3.57H69a3.2,3.2,0,0,0,3.44-3.55q0-5.9,0-11.81c0-1.16.12-1.23,1.21-.79a4.35,4.35,0,0,1,1.47,1q4.13,4.14,8.27,8.27a4.34,4.34,0,0,1,1.34,3.22q0,13.66,0,27.33c0,0.81-.27,1.06-1,1-1-.11-2.27.42-2.91-0.23s-0.16-1.86-.17-2.82c0-3.26,0-6.52,0-9.78,0-2.43-1.16-3.62-3.55-3.62H51.36c-2.4,0-3.57,1.19-3.58,3.6,0,3.94,0,7.87,0,11.81,0,0.84-.21,1.14-1.06,1.06s-2.25.31-2.82-.18-0.22-1.9-.22-2.89C43.67,75.87,43.68,70,43.68,64.17Z"
                      , fill iconColor
                      , transform "translate(-6.6 -6.61)" ] [ ]
          , Svg.path  [ d "M64.23,84.77c-3.79,0-7.57,0-11.36,0-0.77,0-1-.18-1-1q0.06-5.17,0-10.34c0-.81.26-1,1-1q11.35,0,22.71,0c0.77,0,1,.18,1,1q-0.06,5.17,0,10.34c0,0.81-.25,1-1,1C71.79,84.75,68,84.77,64.23,84.77Z"
                      , fill iconColor
                      , transform "translate(-6.6 -6.61)" ] [ ]
          , Svg.path  [ d "M68.31,49.78c0,1.61,0,3.22,0,4.83A1.16,1.16,0,0,1,67,56q-2.75,0-5.51,0a1.16,1.16,0,0,1-1.33-1.38q0-4.78,0-9.56a1.16,1.16,0,0,1,1.35-1.36q2.75,0,5.51,0a1.16,1.16,0,0,1,1.33,1.38C68.29,46.63,68.31,48.21,68.31,49.78Z"
                      , fill iconColor
                      , transform "translate(-6.6 -6.61)" ] [ ]  ]
