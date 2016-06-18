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
