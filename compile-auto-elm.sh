echo 'watching elm file'
cd src && filewatcher main.elm 'elm-make main.elm --output ../public/js/main.js'
