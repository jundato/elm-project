module Commons exposing (..)

import Icons exposing (..)
import Types exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)

appTopBarHeaderText : String -> Html msg
appTopBarHeaderText value =
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

getThemeType: String -> Theme
getThemeType name =
  case name of
    "Default" -> DefaultTheme
    "Default Flat" -> DefaultFlatTheme
    "Dark" -> DarkTheme
    "Dark Flat" -> DarkFlatTheme
    _ -> DefaultTheme

getThemeStyle: Theme -> ((String, String),(String, String))
getThemeStyle theme =
  case theme of
    DefaultTheme -> (themeLibrary.defaultBackgroundStyle, themeLibrary.defaultBackgroundNavStyle)
    DefaultFlatTheme -> (themeLibrary.defaultBackgroundFlatStyle, themeLibrary.defaultBackgroundNavStyle)
    DarkTheme -> (themeLibrary.darkBackgroundStyle, themeLibrary.darkBackgroundNavStyle)
    DarkFlatTheme -> (themeLibrary.darkBackgroundFlatStyle, themeLibrary.darkBackgroundNavStyle)

themeLibrary : ThemeLibrary
themeLibrary =  { defaultBackgroundStyle = ("background", "-webkit-linear-gradient(-90deg, #005fa9, #00417a)")
                , defaultBackgroundFlatStyle = ("background", "#005fa9")
                , defaultBackgroundNavStyle = ("background", "#003169")
                , darkBackgroundStyle = ("background", "-webkit-linear-gradient(-90deg, #a1a2a6, #4c4c4e)")
                , darkBackgroundFlatStyle = ("background", "#a1a2a6")
                , darkBackgroundNavStyle = ("background", "#4c4c4e")
                }

-- model for monitors
defaultMonitor : String -> Bool -> Monitor
defaultMonitor number' isVisible' =  { number = number'
                          , isSelected = False
                          , isVisible = isVisible'
                          , vgaOne = "XBAND RADAR"
                          , vgaTwo = "XBAND RADAR"
                          , dviOne = "XBAND RADAR"
                          , dviTwo = "XBAND RADAR"
                          , videoOne = "XBAND RADAR"
                          , videoTwo = "XBAND RADAR"
                          , videoThree = "XBAND RADAR"
                          , isVgaOneCycle = True
                          , isVgaTwoCycle = False
                          , isDviOneCycle = False
                          , isDviTwoCycle = False
                          , isVideoOneCycle = False
                          , isVideoTwoCycle = False
                          , isVideoThreeCycle = False
                          , isPipUpDownPressed = False
                          , isPipLeftRightPressed = False
                          , isPipResizePressed = False
                          , isOsdUpDownPressed = False
                          , isOsdLeftRightPressed = False
                          , isOsdSelectPressed = False
                          , isOn = False
                          }
