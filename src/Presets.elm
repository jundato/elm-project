module Presets exposing (..)

import Types exposing (..)
import Commons exposing (..)
import Icons exposing (..)
import PresetsPorts exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json

-- MODEL
type alias Model =  { selectedTheme : Theme
                    , presets : List Preset
                    , monitors : List Monitor
                    , hasSelected : Bool }

type alias Preset = { id : Int
                    , name : String
                    , tempName : String
                    , monitors : List Monitor
                    , isSelected : Bool
                    , isEditingName : Bool }

defaultModel : Model
defaultModel =  { selectedTheme = DefaultTheme
                , presets = [ defaultPreset 1
                            , defaultPreset 2
                            , defaultPreset 3
                            , defaultPreset 4
                            , defaultPreset 5
                            , defaultPreset 6 ]
                , monitors = [ ]
                , hasSelected = True }

-- model for presets
defaultPreset : Int -> Preset
defaultPreset id' = { id = id'
                    , name = "<empty>"
                    , tempName = ""
                    , monitors = []
                    , isSelected = False
                    , isEditingName = False }
type Msg
  = NoOp
  | ClosePresetSettings
  | PresetSelected Preset
  | PresetEdit Preset
  | PresetCommit
  | PresetNameInput Preset String
  | PresetNameEditDone Preset
  | PresetEditCancel Preset

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    NoOp -> model ! [ ]
    ClosePresetSettings -> model ! [ PresetsPorts.out_presetSettingsClosed ""]
    PresetSelected preset ->
      let newPreset = { preset | isSelected = not preset.isSelected }
          newPresets  = updateSelectedPreset newPreset model.presets
      in { model  | presets = newPresets
                  , hasSelected = newPreset.isSelected }  ! [ ]
    PresetEdit preset ->
      { model | presets = setPresetToEdit preset model.presets } ! [ ]
    PresetCommit ->
      let selectedPresets = findPresets model.presets
          selectedPreset =
            case List.take 1 selectedPresets of
              [preset] -> preset
              _ -> defaultPreset -1
      in { model | presets = setPresetCommit selectedPreset model.presets model.monitors } ! [ ]
    PresetNameInput preset value ->
      { model | presets = setPresetName preset value model.presets } ! [ ]
    PresetNameEditDone preset ->
      { model | presets = setPresetNameCommit preset model.presets } ! [ ]
    PresetEditCancel preset ->
      { model | presets = cancelPresetEdit preset model.presets } ! [ ]


init : (Model, Cmd Msg)
init = defaultModel ! []

view : Model -> Html Msg
view model =
  let
    (lowerBodyStyle, upperBodyStyle) = getThemeStyle model.selectedTheme
  in div [ ]  [ presetSettingTopBarView model upperBodyStyle
              , presetSettingBodyView model lowerBodyStyle ]

-- top bar for monitor setting view
presetSettingTopBarView : Model -> (String, String) -> Html Msg
presetSettingTopBarView model style' =
  div [ class "app-top-bar vdiv-1-10", style [ style' ] ]
      [ div [ class "div-1-10 vdiv-1-1 content-centered nav-header" ]
            [ appTopBarHeaderText " " ]
      , div [ class "div-1-10 float-right", onClick ClosePresetSettings ] [ closeIconView ] ]

-- main body for monitor setting view
presetSettingBodyView : Model -> (String, String) -> Html Msg
presetSettingBodyView model style' =
  div [ class "app-body vdiv-9-10", style [ style' ] ]
      [ div [ class "vdiv-1-2 div-1-1" ]
            (List.map presetContainerView model.presets)
      , div [ class "vdiv-1-2 div-1-1 content-centered" ]
            [ div [ class "div-1-1 vdiv-1-2 " ]
                  [ div [ class "vdiv-1-1"
                        , onClick PresetCommit ]
                        [ saveIcon model.hasSelected ] ] ] ]
-- container for the preset button

presetContainerView : Preset -> Html Msg
presetContainerView preset = div [ class "vdiv-1-3 div-1-2 align-center preset-button-container" ] [ presetButtonView preset ]

presetButtonView : Preset -> Html Msg
presetButtonView preset =
  let isEditingName = preset.isEditingName
      isSelectedClass = if preset.isSelected then " selected" else " x"
  in  div [ class ("preset-button div-4-5 vdiv-1-2 content-centered" ++ isSelectedClass)
          , onDoubleClick (PresetEdit preset)
          , onClick (PresetSelected preset) ]
          [ div [ class ("div-4-5 vdiv-1-1 PresetNameEditDone" ++ if isEditingName then " hidden" else "") ] [ div [ class "vdiv-1-1 div-1-1 content-centered" ] [ text preset.name ] ]
          , div [ class ("div-1-1 vdiv-1-1" ++ if not isEditingName then " hidden" else "")
                , onEsc NoOp (PresetEditCancel preset) ]
                [ input [ class "preset-button-input vdiv-1-1"
                        , type' "text"
                        , value preset.tempName
                        , on "input" (Json.map (PresetNameInput preset) targetValue )
                        , onEnter NoOp (PresetNameEditDone preset) ][ ] ] ]

---- PRESET SETTING FUNCTIONS
setPresetToSelected : Preset -> List Preset -> List Preset
setPresetToSelected preset presets =
  List.map (\p -> if  p.id == preset.id then { p  | isSelected = not p.isSelected }
                  else { p  | tempName = "" } ) presets

updateSelectedPreset : Preset -> List Preset  -> List Preset
updateSelectedPreset preset presets =
  List.map (\p -> if  p.id == preset.id then preset
                  else { p | isSelected = False } ) presets
setPresetToEdit : Preset -> List Preset -> List Preset
setPresetToEdit preset presets =
  List.map (\p -> if  p.id == preset.id then { p  | isEditingName = not p.isEditingName
                                                  , tempName = p.name
                                                  , isSelected = False }
                  else { p  | isEditingName = False
                            , tempName = ""
                            , isSelected = False } ) presets

setPresetCommit : Preset -> List Preset -> List Monitor -> List Preset
setPresetCommit preset presets monitors' =
  List.map (\p -> if  p.id == preset.id then { p  | monitors = monitors' }
                  else p ) presets

cancelPresetEdit : Preset -> List Preset -> List Preset
cancelPresetEdit preset presets =
  List.map (\p -> if  p.id == preset.id then { p | isEditingName = False }
                  else p ) presets


setPresetName : Preset -> String -> List Preset -> List Preset
setPresetName preset value presets =
  List.map (\p -> if  p.id == preset.id then { p | tempName = value }
                  else p ) presets

setPresetNameCommit : Preset -> List Preset -> List Preset
setPresetNameCommit preset presets =
  List.map (\p -> if  p.id == preset.id then { p  | name = p.tempName
                                                  , isEditingName = False }
                  else p ) presets

findPresets : List Preset -> List Preset
findPresets presets = List.filterMap findIsSelected presets

findIsSelected : Preset -> Maybe Preset
findIsSelected preset =
  if preset.isSelected then
    Just preset
  else
    Nothing

onEnter : msg -> msg -> Attribute msg
onEnter fail success =
  let
    tagger code =
      if code == 13 then success
      else fail
  in
    on "keyup" (Json.map tagger keyCode)

onEsc : msg -> msg -> Attribute  msg
onEsc fail success =
  let
    tagger code =
      if code == 27 then success
      else fail
  in
    on "keyup" (Json.map tagger keyCode)
