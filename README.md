to run this app:
* clone the repo to your machine
* Need to have a firebase account to create the db https://console.firebase.google.com/
* there's a socialbee server and socialbee client which need to be run separately
* cd to socialbee-server/socialbee-functions/functions and run 'npm install'
* cd to socialbee-client and run 'npm install'
* to run the server cd into socialbee-server/socialbee-functions/functions and run firebase deploy
* to run the client cd into socialbee-client and run 'npm start' which start the react server on localhost

* if you're running the server locally (socialbee-server/socialbee-functions/functions/ 'firebase serve')
  then your api-s will be run locally e.g. http://localhost:5000/socialbee-c0ea7/us-central1/createBuzz
* if you're running firebase deploy, the cloud firebase functions will be run e.g. https://us-central1-socialbee-c0ea7.cloudfunctions.net/api/buzz/AqwEaPAdpZoAllUBxD4p/like
