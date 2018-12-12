while lsof -Pi :3000 -sTCP:LISTEN
do
  :
done
npm start && sh keepup.sh
