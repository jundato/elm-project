echo 'watching elm file'
cd src && filewatcher '**/*.elm' 'elm-make main.elm --output ../public/js/main.js'
cd ../..
