module Types exposing (..)

-- model for monitor
type alias Monitor =  { number : String
                      , isSelected : Bool
                      , isVisible : Bool
                      , vgaOne : String
                      , vgaTwo : String
                      , dviOne : String
                      , dviTwo : String
                      , videoOne : String
                      , videoTwo : String
                      , videoThree : String
                      , isVgaOneCycle : Bool
                      , isVgaTwoCycle : Bool
                      , isDviOneCycle : Bool
                      , isDviOneCycle : Bool
                      , isDviTwoCycle : Bool
                      , isVideoOneCycle : Bool
                      , isVideoTwoCycle : Bool
                      , isVideoThreeCycle : Bool
                      , isPipUpDownPressed : Bool
                      , isPipLeftRightPressed : Bool
                      , isPipResizePressed : Bool
                      , isOsdUpDownPressed : Bool
                      , isOsdLeftRightPressed : Bool
                      , isOsdSelectPressed : Bool
                      , isOn : Bool
                      }

type Theme = DefaultTheme | DefaultFlatTheme | DarkTheme | DarkFlatTheme
type alias ThemeLibrary = { defaultBackgroundStyle : (String, String)
                          , defaultBackgroundFlatStyle : (String, String)
                          , defaultBackgroundNavStyle : (String, String)
                          , darkBackgroundStyle : (String, String)
                          , darkBackgroundFlatStyle : (String, String)
                          , darkBackgroundNavStyle : (String, String)
                          }


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
