![](./readmeAssets/wordmark.png)
##### playPORTAL <sup>TM</sup> provides a service to app developers for managing users of all ages and the data associated with the app and the app users, while providing compliance with required COPPA laws and guidelines.

# <b> playPORTAL Javascript SDK</b></br>

## Getting Started

* ## <b>Step 1:</b> Create playPORTAL Partner Account

	* Navigate to [playPORTAL Partner Dashboard](https://partner.playportal.io)
	* Click on <b>Sign Up For Developer Account</b>
	* After creating your account, email us at [info@playportal.io](mailto:info@playportal.io?subject=Developer%20Sandbox%20Access%20Request) to verify your account.
  </br>

* ## <b>Step 2:</b> Register your App with playPORTAL

	* After confirmation, log in to the [playPORTAL Partner Dashboard](https://partner.playportal.io)
	* In the left navigation bar click on the <b>Apps</b> tab.
	* In the <b>Apps</b> panel, click on the "+ Add App" button.
	* Add an icon, name & description for your app.
	* For "Environment" leave "Sandbox" selected.
	* Click "Add App"
  </br>

* ## <b>Step 3:</b> Generate your Client ID and Client Secret

	* Tap "Client IDs & Secrets"
	* Tap "Generate Client ID"
	* The values generated will be used in 'Step 4'.
  </br>

* ## <b>Step 4:</b> Create a react-native app (if app doesn't exist)
```
$ react-native init yourapp
```
This step will walk you through creating a new React Native project in /Users/x/software/ReactNative/yourapp
Installing react-native...

+ react-native@0.56.0
added 766 packages from 361 contributors and audited 15204 packages in 21.763s
found 0 vulnerabilities

Setting up new React Native app in /Users/x/software/ReactNative/yourapp
Installing React...
+ react@16.4.1
added 1 package and audited 15228 packages in 4.435s
found 0 vulnerabilities

Installing Jest...
npm WARN deprecated istanbul-lib-hook@1.2.1: 1.2.0 should have been a major version bump
+ babel-preset-react-native@5.0.2
+ babel-jest@23.4.0
+ jest@23.4.1
+ react-test-renderer@16.4.1
added 306 packages from 284 contributors, updated 1 package and audited 39601 packages in 12.27s
found 0 vulnerabilities


* ## <b>Step 5:</b> Install the playportal SDK
```
$ npm i playportal
```

The playportal package utilizes semver for release numbering. Our recommendation is to stay within a major release to avoid breaking changes. This can be achieved via your package.json by defining playportal (in your dependencies list) as:
    "playportal": "^0.1.4"




* ## <b>Step 6:</b> Add Client ID and Client Secret to App
  * Add the following to the "include" section of your App.js (or other main application module).
    * ###### For the purpose of running yourapp, these keys are in plain text in the file, but for a production app you must store them securely - they uniquely identify your app and grant the permissions to your app as defined in the playPORTAL Partner Dashboard.

  * #### React-Native Example
    ```
    import {
      PPManager,
      PPconfigure,
      PPisAuthenticated,
      PPgetLoginRoute,
      PPhandleOpenURL,
      PPaddUserListener,  
      PPreadData,
      PPwriteData,
      PPgetFriends
    } from './node_modules/playPORTAL/ppsdk/src/PPManager';


    // -----------------------------------------------------------------
    // Copy your user defines from playPORTAL dev website
    // -----------------------------------------------------------------
    const cid = '<YOUR CLIENT_ID HERE>';
    const cse = '<YOUR CLIENT_SECRET HERE>';
    const redir = '<YOUR REDIRECT_URI HERE>';
```

   And, in your app startup, add the initialization to the componentDidMount method:

```		
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
    ```

* ## <b>Step 7:</b> Configure your app for SSO (requires URL redirects aka deep linking)

* #### iOS
In the apps Info.plist add the following lines (either from Xcode or editing the file):

```
	<key>CFBundleURLTypes</key>
	<array>
	  <dict>
	    <key>CFBundleTypeRole</key>
	    <string>Editor</string>
	    <key>CFBundleURLName</key>
	    <string>helloworld</string>
	    <key>CFBundleURLSchemes</key>
	    <array>
	      <string>helloworld</string>
	      </array>
	    </dict>
	  </array>
```	  


In the AppDelegate.m add the import for React-Native deep linking:
```
  #import <React/RCTLinkingManager.h>
```

In the AppDelegate.m add the following lines (above the `@end`):
```
  - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
    sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
    {
      return [RCTLinkingManager application:application openURL:url
			     sourceApplication:sourceApplication annotation:annotation];
    }        
```

* #### Android

* ## <b>Step 8:</b> Install the deep linking package for React-Native
```
$ npm install react-native-deep-linking
+ react-native-deep-linking@2.1.0
added 1 package from 1 contributor and audited 39661 packages in 5.752s
found 0 vulnerabilities
```

* ## <b>Step 9:</b> Relink the react-native app
```
$ react-native link
```


* ## <b>Step 10:</b> Running your app
```
$ cd /Users/x/software/ReactNative/yourapp
```

* ##### To run your app on iOS
```
$ react-native run-ios
```
   - or -

```	 
   Open ios/yourapp.xcodeproj in Xcode
   Hit the Run button
```

* ##### To run your app on Android
```
$ cd /Users/x/software/ReactNative/yourapp
```
NB: Have an Android emulator running (quickest way to get started), or a device connected

```
$ react-native run-android
```


* ### <b>Step 11:</b> Generate "Sandbox" users for testing.
  * In the [playPORTAL Partner Dashboard](https://partner.playportal.io), click on "Sandbox" in the left navigation pane.
  * Here you can generate different types of "Sandbox Users" so you can log in to your app and try it out.
  * "Sandbox Users" can be of type "Adult", "Parent", or "Child".
  * You can also create friendships between the users using the dropdowns in each "profile preview".

* ### For futher information run any of the playPORTAL Hello World Apps that use the playPORTAL JavaScript SDK.
  * playPORTAL Hello World For React Native (Coming Soon!)
  * playPORTAL Hello World For NodeJS (Coming Soon!)


* ### Using the playPORTAL service


#### Making calls into the PPSDK plugin.

##### SSO Login / Authentication
The SSO login validates a single user (player) against the playPORTAL. Players may log in with a valid playPORTAL set of credentials. If they've previously logged in, then they can continue to operate as a logged in user. 

The PPconfigure method is used to initiate this process. In conjunction with your UserListener function, the app can either:
- if user is currently un-authorized, log a user in via SSO, and then allow full use of the playPORTAL SDK
- if user is currently authorized, silently log in (no user interaction) and then allow full use of the playPORTAL SDK

- First, define a UserListener function that will be invoked on change of Auth status. 
```
  export const UserListener = (u, authUpdate) => {
	console.log("UserListener invoked on user:", JSON.stringify(userprofile) +" auth status:"+ authUpdate);
	authenticated = authUpdate;
	if(authenticated == true) {
	    userprofile = u; // save user profile for display, etc
	} else {
	   // display modal with login button or redirect to SSO login
	   ssoUrl = PPgetLoginRoute(); // get URL for SSO login


	}
  }
```


Then configure the SDK (see parameters from above desciption). This starts the process and the UserListener will be invoked with auth status.
```
	PPconfigure(cid, cse, redir, [SANDBOX | PRODUCTION]);  // last parm, environment is optional. defaults to SANDBOX
```
--

##### User / Friends
The SDK provides methods for accessing a user's profile and a user's friends profiles. 

The user's profile is returned to the UserListener, when the user is "auth'd". The user profile contains the following properties:


```
  PPgetFriends()
    .then((response) => {
      console.log("friends:", response);
    })
    .catch((error) => {
      console.error(error);
    })
```

##### Data
The SDK provides a simple Key Value (KV) storage. On login, there are two data stores opened / created for this user. There is a private data store for this users exclusive use, and there is a global data store this user shares with all other users of this same app. If a user logs out and logs in at a later date, the data in the private data store will be as left upon logout. The contents of the global data store will most likely have changed based on write operation of other users.


	    PPwriteData(bucketname, key, value);
	    	string bucketname - the name of the data store
		string key - a key to associate with this data
    		string value - value to store

    	This method will write a KV pair to the referenced data store. If a key is used more than once for writing, the 		value associated with the key will be updated and reflect the most recent write operation.



	    void writeGlobalData(string key, string value);

   			string key - a key to associate with this data
    		string value - value to store

    	This method will write a KV pair to this application's global data store. Again, if a key is used more than once (by any user), the value associated with the key will be updated.

--

         public void PPreadData(string key, <string>callback);

			string key - a key to read from.
			callback - C# method that takes a string parameter containing the returned value

			The callback method is defined as:
						
			private delegate void ReadDataDelegate(string value);
			[AOT.MonoPInvokeCallback(typeof(ReadDataDelegate))]  
			protected static void ReadCallback(string value)
			{
				// do something with the value
			}

