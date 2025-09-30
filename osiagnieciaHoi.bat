@echo off


start cmd /k "cd /d hoi && npm run dev"


start cmd /k "cd /d hoi4-backend && node server.js"

timeout /t 5
start http://localhost:5173/

exit
