# playPORTAL
Javascript SDK for developing apps/games/toys utilizing the playPORTAL services.

### Getting started
From the root of your project, install the playPORTAL SDK with:
$ npm install playPORTAL --save

Add the following to your App.js (or other main application module)
For React-Native
import import { PPManager, PPconfigure, PPisAuthenticated, PPgetLoginRoute, PPhandleOpenURL, PPaddUserListener,  PPreadData, PPwriteData, PPgetFriends } from './node_modules/playPORTAL/ppsdk/src/PPManager';
