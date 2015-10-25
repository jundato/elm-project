module GreenGui.Main where

import Color exposing (..)
import Graphics.Collage exposing (..)
import Graphics.Element exposing (..)
  
main =
  collage 1024 600
    [ move (0, 0) blueSquare
    , move (0, 0) redSquare
    ]

blueSquare : Form
blueSquare =
  traced (dashed blue) square


redSquare : Form
redSquare =
  traced (solid red) square


square : Path
square =
  path [ (50,50), (50,-50), (-50,-50), (-50,50), (50,50) ]