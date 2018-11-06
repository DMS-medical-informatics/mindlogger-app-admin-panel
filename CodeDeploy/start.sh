curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | sudo bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
ls > ls.txt
pwd > pwd.txt
sudo nvm install node
sudo npm install
sudo npm update
sudo npm install node-sass install.js
sudo npm rebuild node-sass
sudo npm start
