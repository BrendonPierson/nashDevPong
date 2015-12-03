# nashDevPong
This web app allows users to record local, friendly ping pong match results.  A rating algorithm based on the [ELO system](https://en.wikipedia.org/wiki/Elo_rating_system) is used to rank players.  To facilitate user signup, OAuth with github is the signup and login method.  Data is structured to allow matches and ratings to be separated into specific leagues if user growth requires it.

[Live Demo](https://nashdev-pong.firebaseapp.com)

###Core Technologies Used:
1. [Angularjs](https://angularjs.org/)
2. [Angular Material](https://material.angularjs.org/)
3. [lodash](https://lodash.com/)
4. [Firebase](https://www.firebase.com/)

###Dependencies:
1. [Nodejs](https://nodejs.org/en/)
2. [Bower](http://bower.io/)
3. [Grunt](http://gruntjs.com/)
4. [SASS](http://sass-lang.com/guide)

###Customization
If you would like to use this app in your office or with a group of friends, all you need to do is sign up for a firebase account, create a new app, and edit these two lines in the `app.const.js` file. 

	var ref = "https://nashdev-pong.firebaseio.com/";
    var defaultLeague = "-K1OjDAX9cALaca8PGQh";
    
The ref should be whatever the address of your firebase app. ie `var ref = "https://<your app name here>.firebaseio.com/";`
The defaultLeague can be set to any of the leagues you create.

###Contributing 
1. Fork and clone the repo
2. cd into the lib directory and run npm start
3. Create a branch and work on a specific issue or feature
4. Submit a pull request for the feature

