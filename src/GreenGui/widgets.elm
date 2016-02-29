module GreenGui.Widgets (powerIcon, nightModeIcon, monitorIcon, lockIcon
                        , presetIcon, menuIcon, informationIcon, pipIcon
                        , osdIcon, leftRightIcon, upDownIcon, resizeIcon
                        , exitPipIcon, selectIcon, selectAllIcon, themeIcon
                        , exitOsdIcon,closeIcon) where

import Svg exposing (..)
import Svg.Attributes exposing (..)

-- <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 202.09 47.35">
--   <defs><style>.cls-1{fill:#231f20;}</style></defs>
--   <title>select_all</title>
--   <rect class="cls-1" x="9.95" y="19.1" width="81.3" height="9.2"/>
--   <polygon class="cls-1" points="0 23.74 23.74 0 29.18 5.7 11.41 23.47 29.57 41.64 23.87 47.35 0 23.74"/>
--   <rect class="cls-1" x="110.85" y="19.1" width="81.3" height="9.2"/>
--   <polygon class="cls-1" points="202.09 23.74 178.35 0 172.91 5.7 190.69 23.47 172.51 41.64 178.22 47.35 202.09 23.74"/>
-- </svg>
selectAllIcon : Svg
selectAllIcon =
  let containerWidth = 204
      containerHeight = 48
      color = "#231f20"
  in  svg [ version "1.1"
          , height "20px"
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

powerIcon : Bool -> Svg
powerIcon isDisabled =
  let containerWidth = 300
      containerHeight = 300
      color = if isDisabled then "#333" else "#B62025"
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M163.3,158.1c0,7.4-6,13.5-13.5,13.5l0,0c-7.4,0-13.5-6-13.5-13.5V35.9c0-7.4,6-13.5,13.5-13.5l0,0c7.4,0,13.5,6,13.5,13.5V158.1z"
                      , fill color ] [ ]
          , Svg.path  [ d "M186.5,56.7c39.4,14.8,67.3,52.8,67.3,97.3c0,57.4-46.5,103.9-103.9,103.9S45.9,211.5,45.9,154.1c0-44.6,28-82.6,67.4-97.3"
                      , stroke color
                      , strokeWidth "28"
                      , strokeLinecap "round"
                      , strokeMiterlimit "10"
                      , fill "none" ] [ ] ]

nightModeIcon : Svg
nightModeIcon =
  let containerWidth = 300
      containerHeight = 300
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M141.6,4.1c-4.1,0-8.1,0.2-12.1,0.5C179.2,21.3,215,68.2,215,123.5c0,69.3-56.1,125.4-125.4,125.4c-29.3,0-56.3-10.1-77.7-26.9c25,45.9,73.6,77,129.6,77C223,299,289,233,289,151.6S223,4.1,141.6,4.1z"
                      , fill "#000" ] [ ] ]

monitorIcon : String -> Bool -> Svg
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
          , Svg.text'   [ transform "matrix(1 0 0 1 70.4414 74.5479)", fontFamily "Arial-Black", fontSize "36px" ] [ text label ] ]

lockIcon : Svg
lockIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M36.6,66.4c0,0,3.5-1.7,6.8,1.2l5.3,7.7c1.1,0.3,2.1-0.2,2.8-1.1V37.4c0-1.4,1.3-3.4,2.8-3.4h1.4c1.6,0,2.8,2,2.8,3.4v22.5c2,1.8,3,0.4,3.3-0.8V32c0-1.4,1.3-3.4,2.8-3.4h1.4c1.6,0,2.8,2,2.8,3.4v26.2c1.4,1.8,2.8,0.8,3.3,0.3V34.9c0-1.4,1.3-3.4,2.8-3.4h1.4c1.6,0,2.8,2,2.8,3.4v25.8c0.1,0.1,0.2,0.3,0.2,0.4c0.9,2,2.5,0.7,3.1,0.1V43.9c0-1.4,1.3-3.4,2.8-3.4h1.4c1.6,0,2.8,2,2.8,3.4v21.6c2.3,14.5,2.1,33.2-18.3,33.2c-21.8,0-24.6-7-26-11.5c-0.8-2.6-2-5.1-2.9-6.7l-6.1-10.3C35.1,69.2,35.3,67.4,36.6,66.4z"
                      , fill "#BCBEC0" ] [ ] ]



presetIcon : Svg
presetIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
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

menuIcon : Svg
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
                      , transform "translate(-14.36 14) scale(0.8)"
                      , fill "#BCBEC0" ] [ ] ]

informationIcon : Svg
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

pipIcon : Svg
pipIcon =
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

osdIcon : Svg
osdIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M104.3,33.2c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C78.6,33.2,91.3,33.2,104.3,33.2zM98.7,57.4c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C80.6,57.4,89.4,57.4,98.7,57.4z"
                      , fill "#3C2F90" ] [ ]
          , Svg.path  [ d "M28.9,89.8c17.5,0,43.3,0,62.8,0c0-7.5,0-14.7,0-22.3c1.9,0,3.4,0,5.2,0c0,9.1,0,18.2,0,27.7c-24.4,0-48.7,0-73.6,0c0-17.5,0-52.3,0-52.3h36.2l0,5H29v37.6"
                      , fill "#3C2F90" ] [ ]
          , Svg.path  [ d "M32.2,72.5l1.1,3.8c0,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.2,0.1,0.4,0.1l3.5-0.7c0.7,1.2,1.5,2.3,2.5,3.2l-1.4,3.3c0,0.1-0.1,0.3,0,0.4c0,0.1,0.1,0.2,0.2,0.3l3.5,1.9c0.1,0.1,0.2,0.1,0.4,0.1c0.1,0,0.2-0.1,0.3-0.2l2-2.9c1.3,0.4,2.7,0.5,4,0.5l1.3,3.3c0,0.1,0.1,0.2,0.3,0.3c0.1,0.1,0.3,0.1,0.4,0l3.8-1.1c0.1,0,0.2-0.1,0.3-0.2c0.1-0.1,0.1-0.2,0.1-0.4l-0.7-3.5c1.2-0.7,2.3-1.5,3.2-2.5l3.3,1.4c0.1,0,0.3,0.1,0.4,0c0.1,0,0.2-0.1,0.3-0.2l1.9-3.5c0.1-0.1,0.1-0.2,0.1-0.4c0-0.1-0.1-0.2-0.2-0.3l-2.9-2c0.4-1.3,0.5-2.7,0.5-4l3.3-1.3c0.1-0.1,0.2-0.1,0.3-0.3c0.1-0.1,0.1-0.3,0-0.4l-1.1-3.8c0-0.1-0.1-0.2-0.2-0.3c-0.1-0.1-0.2-0.1-0.4-0.1l-3.5,0.7c-0.7-1.2-1.5-2.3-2.5-3.2l1.4-3.3c0-0.1,0.1-0.3,0-0.4c0-0.1-0.1-0.2-0.2-0.3l-3.5-1.9c-0.1-0.1-0.2-0.1-0.4-0.1c-0.1,0-0.2,0.1-0.3,0.2l-2,2.9c-1.3-0.4-2.7-0.5-4-0.5l-1.3-3.3c0-0.1-0.1-0.2-0.3-0.3c-0.1-0.1-0.3-0.1-0.4,0L42,54.9c-0.1,0-0.2,0.1-0.3,0.2c-0.1,0.1-0.1,0.2-0.1,0.4l0.7,3.5c-1.2,0.7-2.3,1.5-3.2,2.5l-3.3-1.4c-0.1,0-0.3-0.1-0.4,0c-0.1,0-0.2,0.1-0.3,0.2l-1.9,3.5c-0.1,0.1-0.1,0.2-0.1,0.4c0,0.1,0.1,0.2,0.2,0.3l2.9,2c-0.4,1.3-0.5,2.7-0.5,4l-3.3,1.3c-0.1,0-0.2,0.1-0.3,0.3C32.2,72.3,32.2,72.4,32.2,72.5z M41.5,71.9c-1.1-3.8,1.1-7.7,4.9-8.8c3.8-1.1,7.7,1.1,8.8,4.9c1.1,3.8-1.1,7.7-4.9,8.8C46.5,77.9,42.6,75.7,41.5,71.9z"
                      , fill "#3C2F90"] [ ] ]


leftRightIcon : Svg
leftRightIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.rect  [ x "30.5"
                      , y "40.7"
                      , width "52.2"
                      , height "8.4"
                      , fill "#58595B" ] [ ]
          , Svg.polygon [ points  "21.5,44.9 43.1,23.3 48.1,28.5 31.9,44.7 48.4,61.2 43.2,66.4"
                        , fill "#58595B" ] [ ]
          , Svg.rect  [ x "45.5"
                      , y "78.7"
                      , width "52.2"
                      , height "8.4"
                      , fill "#58595B" ] [ ]
          , Svg.polygon [ points  "106.7,82.8 85.1,104.4 80.2,99.2 96.3,83 79.8,66.5 85,61.3"
                        , fill "#58595B" ] [ ] ]

upDownIcon : Svg
upDownIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.rect  [ x "40.6"
                      , y "30.3"
                      , width "8.4"
                      , height "52.4"
                      , fill "#58595B" ] [ ]
          , Svg.polygon [ points  "44.8,21.2 23.2,42.9 28.4,47.8 44.6,31.6 61.1,48.2 66.3,43"
                        , fill "#58595B" ] [ ]
          , Svg.rect  [ x "78.6"
                      , y "45.2"
                      , width "8.4"
                      , height "52.2"
                      , fill "#58595B" ] [ ]
          , Svg.polygon [ points  "82.7,106.5 104.3,84.8 99.1,79.9 83,96.1 66.4,79.5 61.2,84.7"
                        , fill "#58595B" ] [ ] ]

resizeIcon : Svg
resizeIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M24.4,95.1c0-17.5,0-34.7,0-52.3c11.9,0,23.7,0,35.9,0c0.1,1.5,0.2,3,0.3,5c-10.2,0-30.5,0-30.5,0v37.6l17.7-17.1H35l-0.3-5.3c0,0,14.4,0,21.9,0c0,6.9,0,14,0,21.6c-1.4,0.1-2.9,0.2-5,0.3c0-3.8,0-12.9,0-12.9S38.6,85,34.2,89.8c17.5,0,39.1,0,58.5,0c0-7.5,0-14.7,0-22.3c1.9,0,3.4,0,5.2,0c0,9.1,0,18.2,0,27.7C73.6,95.1,49.2,95.1,24.4,95.1z"
                      , fill "#21409A" ] [ ]
          , Svg.path  [ d "M103.3,33.1c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C77.6,33.1,90.4,33.1,103.3,33.1zM97.8,57.3c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C79.7,57.3,88.5,57.3,97.8,57.3z"
                      , fill "#21409A" ] [ ] ]

exitPipIcon : Svg
exitPipIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M106.8,28.2c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C81.1,28.2,93.8,28.2,106.8,28.2zM101.2,52.4c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C83.1,52.4,91.9,52.4,101.2,52.4z"
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

selectIcon : Svg
selectIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.polygon   [ points "52.6,95.9 31.2,75.3 36.2,62.3 51.7,82.6 83.9,32.2 95.7,41.3"
                          , fill "#129848" ] [ ] ]

themeIcon : Svg
themeIcon =
  let containerWidth = 150
      containerHeight = 150
      -- <ellipse class="cls-1" cx="65.48" cy="36.85" rx="6.27" ry="23.52" transform="translate(-15.44 39.59) rotate(-39.59)"/>
  in svg [ ]  [ Svg.ellipse [ cx "65.48", cy "36.85", rx "6.27", ry "23.52", transform "translate(-15.44 39.59) rotate(-39.59)" ] [ ]
              , Svg.path  [ d "M40.81,88.45C38,90.79,29,84.57,20.71,74.56S8,54.54,10.83,52.2l32.6-27S44.93,34.13,54.78,46,73.53,61.57,73.53,61.57Z"
                          , transform "translate(-6.98 -10.58)" ] [ ]
              , Svg.path  [ d "M70.64,48.33s5.77,4.84,9.24,8.34,4.84,16.17,2.66,20.83-0.08,9,2.85,9.39,4.68-1.3,5.4-6.18S91.64,61.4,76.84,50.24"
                          , transform "translate(-6.98 -10.58)"
                          , fill "#3c2f90" ] [ ]
              , Svg.path  [ d "M37.11,53.22c0-.07-4.49-6.71-8.62-14.5C22.79,28,20.37,20.21,21.3,15.62A6.26,6.26,0,0,1,24,11.43c3.87-2.55,9.08.45,19.94,11.45l-2.63,2.6c-10.39-10.53-14-11.77-15.27-11a2.58,2.58,0,0,0-1.07,1.83C23.39,24,35.42,44.06,40.18,51.16c0,0,.44,1.63-0.45,2.3S37.11,53.22,37.11,53.22Z"
                          , transform "translate(-6.98 -10.58)"
                          , fill "#3c2f90" ] [ ]
              , Svg.path  [ d "M61.39,40.19L77,43.35s4.47,7.07,4.28,8.56-1.68,5.58-5,3.72-9.12-6.33-9.87-8-5.77-6.79-5.77-6.79"
                          , transform "translate(-6.98 -10.58)"
                          , fill "#3c2f90"] [ ] ]

exitOsdIcon : Svg
exitOsdIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M106.8,28.2c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C81.1,28.2,93.8,28.2,106.8,28.2zM101.2,52.4c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C83.1,52.4,91.9,52.4,101.2,52.4z"
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

closeIcon : Svg
closeIcon =
  let containerWidth = 128
      containerHeight = 128
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M22.5,18h24.2l18.6,28.7L84.5,18h22.8L76.9,61l33.1,47H85.2L64.5,76.9L43.4,108H20l33.1-47.1L22.5,18z"
                      , fill "#fff" ] [ ] ]
