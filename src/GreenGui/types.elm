module GreenGui.Types where

-- app states model have screeen states that models what state each screen
-- 1) home screen
-- 2) monitor setting screen
-- 3) preset setting screen
type alias AppState = { currentScreenState : Int
                      , homeScreenState : HomeScreenState
                      , monitorSettingScreenState : MonitorSettingScreenState
                      , presetSettingScreenState : PresetSettingScreenState
                      }

-- initial page that should be displayed, it contains the list of monitors, power down, etc.
type alias HomeScreenState =  { monitors : List Monitor
                              , monitorPageIndex : Int 
                              , isPowerDisabled : Bool
                              }

-- when a monitor is selected this screen state handles it
type alias MonitorSettingScreenState =  { selectedMonitor : Monitor
                                        , isCyclePressed : Bool
                                        , isPipSetPressed : Bool
                                        , isOsdSetPressed : Bool
                                        , isCycleDisabled : Bool
                                        , isPipDisabled : Bool
                                        , isOsdDisabled : Bool }

-- stores presets for monitors etc
type alias PresetSettingScreenState = { presets : List Preset }

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

type alias Preset = { id : Int
                    , name : String 
                    , tempName : String
                    , monitors : List Monitor 
                    , isSelected : Bool
                    , isEditingName : Bool }

-- model for monitors
defaultMonitor : String -> Bool -> Monitor
defaultMonitor number' isVisible' =  { number = number'
                          , isSelected = False
                          , isVisible = isVisible'
                          , vgaOne = ""
                          , vgaTwo = ""
                          , dviOne = ""
                          , dviTwo = ""
                          , videoOne = ""
                          , videoTwo = ""
                          , videoThree = ""
                          , isVgaOneCycle = False
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
