## General Info

This app uses firestore as storage for the messages. The really cool thing about firestore is that you can interact with it from the browser much like you would interact with a database on a server. The security caveat is that in a production scenario you need to define "rules" that restrict which data users can read, write, update, and delete. In this app the db is fully open to any user action from the browser and is not advisable. If I had spent time on users and accounts, that would have facilitated rules that restrict a user to only see messages they have sent or received. I used rxfire to accomplish an OR query in firestore by joining two queries (those the user sent and those the user received). Lastly, by using firestore messages are almost instantly received by the target user without implementing sockets or polling.

Very, very little time was spent on styles and layout. If I were to prioritize forthcoming work on this app, I would put layout and some routing at the top of the list along with user accounts and prop types. In a future iteration I'd like to prevent the user from having to scroll to get to the message input as well as allowing the user to scroll up beyond the 10 message limit I put into the firestore query -- and load those older messages on scroll.

There are three hardcoded users, which I found made for more realistic messaging and user logic than if there were only two. This means that the app could be very easily refactored and iterated on to have many more than three users.

The tests are written with the help of react testing library -- which I found far more developer friendly than my brief experience with enzyme. Most of the tests stub out the DOA functions which are unit tested independently; so no actual db transactions occur when running yarn test. A more end-to-end test suite would involve setting up the firestore emulator.

This app makes use of hooks rather than class components.

Note: This app will not work locally without the api key associated with the firestore database. This should be put in a .env file: REACT_APP_FIREBASE_API_KEY="API-KEY-HERE".

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn test:ci`

Runs the tests on ci. The current build command on netlify is `yarn test:ci && yarn build` .<br />

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**
