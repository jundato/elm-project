module GreenGui.Widgets (powerIcon) where

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
 