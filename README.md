# playPORTAL
Javascript SDK for developing apps/games/toys utilizing the playPORTAL services.

### Getting started
From the root of your project, install the playPORTAL SDK with:
$ npm install playPORTAL --save

Add the following to the "include" section of your App.js (or other main application module).

#### For React-Native
`
    import { PPManager, PPconfigure, PPisAuthenticated, PPgetLoginRoute, PPhandleOpenURL, PPaddUserListener,  PPreadData, PPwriteData, PPgetFriends } from './node_modules/playPORTAL/ppsdk/src/PPManager';


// -----------------------------------------------------------------
// Copy your user defines from playPORTAL dev website
// -----------------------------------------------------------------
const cid = 'iok-cid-e1faabb67829db61a0627dbeaca6ce66573d8913c2eddf94';
const cse = 'iok-cse-74b5b658dd2190a87b426ea7c3face2a3b7a2d35978ac879';
const redir = 'yourappurl://redirect';

// In your app startup

export default class App extends React.Component {
  state = {
    response: {},
  };

  componentDidMount = () => {
    PPaddUserListener(AppListener); // configure callback
    PPconfigure(cid, cse, redir); // do the init
  };

  render() {
    return <RootStack />;
  }
}

`

#### For Node.js
// -------------------------------------------------------
// Node.js app
// -------------------------------------------------------
// In your app
var PPManager = require('./node_modules/playPORTAL/ppsdk/src/PPManager');
