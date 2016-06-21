module SystemPreferences exposing (..)

import Types exposing (..)
import Icons exposing (..)
import Commons exposing (..)
import SystemPreferencesPorts

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

-- MODEL
type alias Model =  { viewState : ViewState
                    , selectedTheme : Theme
                    , maxMonitorDisplays : Int }

type ViewState = Home | MonitorCount | Network | Themes | SoftwareUpdate

defaultModel : Model
defaultModel = { viewState = Home
               , selectedTheme = DefaultTheme
               , maxMonitorDisplays = 5 }

type Msg
  = NoOp
  | CloseSystemPreferences
  | MonitorSharpPress
  | NetworkPress
  | ThemePress
  | SoftwareUpdatePress
  | ThemeSelected String
  | DecreaseMonitorDisplayPress
  | IncreaseMonitorDisplayPress
  | BackToSystemPreferencesMain

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    NoOp -> model ! []
    CloseSystemPreferences -> model ! [ SystemPreferencesPorts.out_onSystemPreferencesClose "" ]
    MonitorSharpPress -> { model | viewState = MonitorCount } ! []
    NetworkPress -> { model | viewState = Network } ! []
    ThemePress -> { model | viewState = Themes } ! []
    SoftwareUpdatePress -> { model | viewState = SoftwareUpdate } ! []
    IncreaseMonitorDisplayPress ->
      let monitorDisplays  = clamp 2 12 (model.maxMonitorDisplays + 1)
      in { model | maxMonitorDisplays = monitorDisplays } ! [ SystemPreferencesPorts.out_updateMonitorMaxDisplays monitorDisplays ]
    DecreaseMonitorDisplayPress ->
      let monitorDisplays = clamp 2 12 (model.maxMonitorDisplays - 1)
      in { model | maxMonitorDisplays = monitorDisplays } ! [ SystemPreferencesPorts.out_updateMonitorMaxDisplays monitorDisplays ]
  ---- type Theme = Default | DefaultFlat | Dark | DarkFlat
    ThemeSelected name ->
      let selectedTheme' =
            case name of
              "Default" -> DefaultTheme
              "Default Flat" -> DefaultFlatTheme
              "Dark" -> DarkTheme
              "Dark Flat" -> DarkFlatTheme
              _ -> DefaultTheme
      in { model | selectedTheme = selectedTheme' } ! [ SystemPreferencesPorts.out_onThemeSelected name ]
    BackToSystemPreferencesMain -> { model | viewState = Home } ! []

init : (Model, Cmd Msg)
init = defaultModel ! []

view : Model -> Html Msg
view model =
  let
    (lowerBodyStyle, upperBodyStyle) = getThemeStyle model.selectedTheme
    (upperBodyView, lowerBodyView) =
      case model.viewState of
        Home -> ( systemPreferencesTopBarView model upperBodyStyle
                , systemPreferencesBodyView model lowerBodyStyle )
        MonitorCount -> ( monitorCountTopBarView model upperBodyStyle
                        , monitorCountBodyView model lowerBodyStyle )
        Network -> ( networkTopBarView model upperBodyStyle
                        , networkBodyView model lowerBodyStyle )
        Themes -> ( themeSelectorTopBarView model upperBodyStyle
                  , themeSelectorBodyView model lowerBodyStyle )
        SoftwareUpdate -> ( softwareUpdateTopBarView model upperBodyStyle
                          , softwareUpdateBodyView model lowerBodyStyle )
  in div  [ class "main" ]
          [ upperBodyView
          , lowerBodyView ]

-- top bar for monitor setting view
systemPreferencesTopBarView : Model -> (String, String) -> Html Msg
systemPreferencesTopBarView model style' =
  div [ class "app-top-bar vdiv-1-10", style [ style' ] ]
      [ div [ class "div-1-10 vdiv-1-1 content-centered nav-header" ]
            [ appTopBarHeaderIcon systemPreferencesIconHeader ]
      , div [ class "div-1-10 float-right", onClick CloseSystemPreferences ] [ closeIconView ] ]

-- main body for monitor setting view
systemPreferencesBodyView : Model -> (String, String) -> Html Msg
systemPreferencesBodyView model style' =
  div [ class "app-body vdiv-9-10", style [style'] ]
      [ div [ ] [ div [ class "div-1-10 vdiv-1-1" ] [ ]
                , div [ class "div-4-5 vdiv-1-1" ]
                      [ div [ class "vdiv-4-5 div-1-1 content-centered" ]
                            [ div [ class "div-1-1 vdiv-1-1 content-centered" ]
                                  [ div [ class "vdiv-1-1 div-2-3 content-centered" ]
                                        [ div [ class "vdiv-2-3 div-2-3 menu content-centered"
                                              , onClick MonitorSharpPress ]
                                              [ monitorSharpIcon ] ]
                                  , div [ class "vdiv-1-1 div-2-3 content-centered" ]
                                        [ div [ class "vdiv-2-3 div-2-3 menu content-centered"
                                              , onClick NetworkPress ]
                                              [ networkIcon ] ]
                                  , div [ class "vdiv-1-1 div-2-3 content-centered" ]
                                        [ div [ class "vdiv-2-3 div-2-3 menu content-centered"
                                              , onClick ThemePress ]
                                              [ themeIcon ] ]
                                  , div [ class "vdiv-1-1 div-2-3 content-centered" ]
                                        [ div [ class "vdiv-2-3 div-2-3 menu content-centered"
                                              , onClick SoftwareUpdatePress ]
                                              [ updateIcon ] ] ] ] ]
                , div [ class "div-1-10 vdiv-1-1" ] [ ] ] ]

monitorCountTopBarView : Model -> (String, String) -> Html Msg
monitorCountTopBarView model style' =
  div [ class "app-top-bar vdiv-1-10", style [ style' ] ]
      [ div [ class "div-1-10 vdiv-1-1 content-centered nav-header" ]
            [ ]
      , div [ class "div-1-10 float-right", onClick BackToSystemPreferencesMain ] [ closeIconView ] ]

monitorCountBodyView : Model -> (String, String) -> Html Msg
monitorCountBodyView model style' =
  div [ class "app-body vdiv-9-10", style [style'] ]
      [ div [ ] [ div [ class "div-1-5 vdiv-1-1" ] [ ]
                , div [ class "div-3-5 vdiv-1-1" ]
                      [ div [ class "vdiv-2-5 div-1-1 content-centered" ]
                            [ div [ class "div-4-5 vdiv-4-5 content-centered" ]
                                  [ monitorSharpIcon ] ]
                      , div [ class "vdiv-1-5 div-1-1 content-centered" ]
                            [ labelIcon (toString model.maxMonitorDisplays) ]
                      , div [ class "vdiv-2-5 div-1-1 content-centered" ]
                            [ div [ class "div-3-5 vdiv-3-5 padded content-centered"
                                  , onClick DecreaseMonitorDisplayPress ]
                                  [ div [ class "div-3-4 vdiv-3-4 button" ] [ leftIcon ] ]
                            , div [ class "div-3-5 vdiv-3-5 padded content-centered"
                                  , onClick IncreaseMonitorDisplayPress ]
                                  [  div [ class "div-3-4 vdiv-3-4 button" ] [ rightIcon ] ] ] ]
                , div [ class "div-1-5 vdiv-1-1" ] [ ] ] ]

themeSelectorTopBarView : Model -> (String, String) -> Html Msg
themeSelectorTopBarView model style' =
  div [ class "app-top-bar vdiv-1-10", style [ style' ] ]
      [ div [ class "div-1-10 vdiv-1-1 content-centered nav-header" ]
            [  ]
      , div [ class "div-1-10 float-right", onClick BackToSystemPreferencesMain ] [ closeIconView ] ]

themeSelectorBodyView : Model -> (String, String) -> Html Msg
themeSelectorBodyView screenState style' =
  div [ class "app-body vdiv-9-10", style [style'] ]
      [ div [ ] [ div [ class "div-1-5 vdiv-1-1" ] [ ]
                , div [ class "div-3-5 vdiv-1-1" ]
                      [ div [ class "vdiv-2-5 div-1-1 content-centered" ]
                            [ div [ class "div-4-5 vdiv-4-5 content-centered" ]
                                  [ themeIcon ] ]
                      , div [ class "vdiv-3-5 div-1-1 content-centered" ]
                            [ div [ class "div-1-4 vdiv-3-5 button padded content-centered"
                                  , onClick (ThemeSelected "Default") ]
                                  [ defaultThemeIcon ]
                            , div [ class "div-1-4 vdiv-3-5 button padded content-centered"
                                  , onClick (ThemeSelected "Default Flat") ]
                                  [ defaultFlatThemeIcon ]
                            , div [ class "div-1-4 vdiv-3-5 button padded content-centered"
                                  , onClick (ThemeSelected "Dark") ]
                                  [ darkThemeIcon ]
                            , div [ class "div-1-4 vdiv-3-5 button padded content-centered"
                                  , onClick (ThemeSelected "Dark Flat") ]
                                  [ darkFlatThemeIcon ] ] ]
                , div [ class "div-1-5 vdiv-1-1" ] [ ] ] ]

networkTopBarView : Model -> (String, String) -> Html Msg
networkTopBarView model style' =
    div [ class "app-top-bar vdiv-1-10", style [ style' ] ]
        [ div [ class "div-1-10 vdiv-1-1 content-centered nav-header" ]
              [ ]
        , div [ class "div-1-10 float-right", onClick BackToSystemPreferencesMain ] [ closeIconView ] ]

networkBodyView : Model -> (String, String) -> Html Msg
networkBodyView model style' =
  div [ class "app-body vdiv-9-10", style [style'] ]
      [ ]

softwareUpdateTopBarView : Model -> (String, String) -> Html Msg
softwareUpdateTopBarView model style' =
  div [ class "app-top-bar vdiv-1-10", style [ style' ] ]
      [ div [ class "div-1-10 vdiv-1-1 content-centered nav-header" ]
            [ appTopBarHeaderText "" ]
      , div [ class "div-1-10 float-right", onClick BackToSystemPreferencesMain ] [ closeIconView ] ]

softwareUpdateBodyView : Model -> (String, String) -> Html Msg
softwareUpdateBodyView model style' =
  div [ class "app-body vdiv-9-10", style [style'] ]
      [ div [ ] [ div [ class "div-1-10 vdiv-1-1" ] [ ]
                , div [ class "div-4-5 vdiv-1-1" ]
                      [ div [ class "vdiv-4-5 div-1-1 content-centered" ]
                            [ div [ class "div-1-1 vdiv-1-1 content-centered" ]
                                  [ div [ class "vdiv-1-1 div-2-3" ]
                                        [ div [ class "vdiv-1-3 div-1-1 content-centered version" ] [ text "Version V1.023" ]
                                        , div [ class "vdiv-2-3 div-1-1 menu content-centered" ]
                                              [ div [ class "vdiv-2-3 div-2-3" ]
                                                    [ updateIcon ] ] ] ] ] ]
                , div [ class "div-1-10 vdiv-1-1" ] [ ] ] ]


-- WIRING --
-- subscriptions : Model -> Sub Msg
-- subscriptions model = Ports.in_startEditingMonitor StartEditingMonitor
