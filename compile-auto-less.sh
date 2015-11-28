export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
echo 'watching less file'
filewatcher less/main.less 'lessc less/main.less > public/css/main.css'


