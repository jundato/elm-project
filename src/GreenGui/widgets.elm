module GreenGui.Widgets (powerIcon, monitorIcon, lockIcon, presetIcon, menuIcon
                        , informationIcon, pipIcon, osdIcon, leftRightIcon
                        , upDownIcon, resizeIcon, exitPipIcon, selectIcon
                        , exitOsdIcon,closeIcon) where

import Svg exposing (..)
import Svg.Attributes exposing (..)


powerIcon : Bool -> Svg
powerIcon isDisabled =
  let containerWidth = 300
      containerHeight = 300
      color = if isDisabled then "#333" else "#DD3A3A"
  in  svg [ version "1.1"
          , height "100%"
          , width "100%"
          , x "0"
          , y "0"
          , viewBox ("0 0 " ++ (toString containerWidth) ++ " " ++ (toString containerHeight)) ]
          [ Svg.path  [ d "M181,17.3V70c33.8,11.9,58,44.2,58,82c0,48-39,87-87,87s-87-39-87-87c0-37.5,23.7-69.5,57-81.7V17.1 C60.3,30.4,14,85.3,14,151c0,75.7,61.3,137,137,137s137-61.3,137-137C288,85.6,242.2,31,181,17.3z"
                      , fill color ] [ ]
          , rect [ x "136", y "2", width "30.3", height "125", fill color ] [ ] ]

monitorIcon : String -> Svg
monitorIcon label =
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
                      , fill "#CBCCCE" ] [ ]
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
          , Svg.text'   [ transform "matrix(1 0 0 1 70.4414 47.5479)", fontFamily "Arial-Black", fontSize "36px" ] [ text label ] ]

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
          [ Svg.path  [ d "M114.3,90.1c0,1.6-1.2,2.9-2.8,2.9H23.9c-1.5,0-2.8-1.3-2.8-2.9V44.9c0,0,0,0,0,0v-6c0-1.6,1.2-2.9,2.8-2.9h18.4c1.5,0,2.8,1.3,2.8,2.9V42h66.5c1.5,0,2.8,1.3,2.8,2.9V90.1z"
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
