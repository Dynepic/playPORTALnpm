![](./readmeAssets/studio.png)
# <b> playPORTAL Javascript SDK</b></br>
##### playPORTAL <sup>TM</sup> provides a service to app developers for managing users of all ages and the data associated with the app and the app users, while providing compliance with required COPPA laws and guidelines.

## Getting Started

##### playPORTAL Studio<sup>TM</sup> provides a service to app developers for managing users of all ages and the data associated with the app and the app users, while providing compliance with required COPPA laws and guidelines.

## Getting Started

* ### <b>Step 1:</b> Create playPORTAL Studio Account

	* Navigate to [playPORTAL Studio](https://studio.playportal.io)
	* Click on <b>Sign Up For FREE Account</b>
	* After creating your account, email us at [info@playportal.io](mailto:info@playportal.io?subject=Developer%20Sandbox%20Access%20Request) to verify your account.
  </br>

* ### <b>Step 2:</b> Register your App with playPORTAL

	* After confirmation, log in to the [playPORTAL Studio](https://studio.playportal.io)
	* In the left navigation bar click on the <b>Apps</b> tab.
	* In the <b>Apps</b> panel, click on the "+ Add App" button.
	* Add an icon, name & description for your app.
	* For "Environment" leave "Sandbox" selected.
	* Click "Add App"
  </br>

* ### <b>Step 3:</b> Generate your Client ID and Client Secret

	* Tap "Client IDs & Secrets"
	* Tap "Generate Client ID"
	* The values generated will be used in 'Step 5'.
  </br>

* ### <b>Step 4:</b> Add a "Registered Redirect URI"

	* Tap "Registered Redirect URIs"
	* Tap "+ Add Redirect URI"
	* Enter your app's redirect uri (e.g. - helloworld://redirect) in to the prompt and click "Submit".
  </br>

* ## <b>Step 5:</b> Create a react-native app (if app doesn't exist)
```
$ react-native init yourapp
```
This will walk you through creating a new React Native project in yourapp working directory, e.g. /Users/x/ReactNative/yourapp
Installing react-native...

+ react-native@0.56.0
added 766 packages from 361 contributors and audited 15204 packages in 21.763s
found 0 vulnerabilities

Setting up new React Native app in /Users/x/ReactNative/yourapp
Installing React...
+ react@16.4.1
added 1 package and audited 15228 packages in 4.435s
found 0 vulnerabilities

Installing Jest...
+ babel-preset-react-native@5.0.2
+ babel-jest@23.4.0
+ jest@23.4.1
+ react-test-renderer@16.4.1
added 306 packages from 284 contributors, updated 1 package and audited 39601 packages in 12.27s
found 0 vulnerabilities


* ## <b>Step 6:</b> Install the playportal SDK
```
$ npm i playportal
```


* ## <b>Step 6:</b> Add Client ID and Client Secret to App
  * Add the following to the "include" section of your App.js (or other main application module).
    * ###### For the purpose of running yourapp, these keys are in plain text in the file, but for a production app you must store them securely - they uniquely identify your app and grant the permissions to your app as defined in playPORTAL Studio.

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


And, in your app startup code, add the initialization to the componentDidMount method:


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

* ## <b>Step 8:</b> Configure your app for SSO (requires URL redirects aka deep linking)

* #### iOS
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
(coming soon!)

* ## <b>Step 9:</b> Install the deep linking package for React-Native
```
$ npm install react-native-deep-linking
+ react-native-deep-linking@2.1.0
added 1 package from 1 contributor and audited 39661 packages in 5.752s
found 0 vulnerabilities
```

* ## <b>Step 10:</b> Relink the react-native app
```
$ react-native link
```


* ## <b>Step 11:</b> Running your app
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


* ### <b>Step 12:</b> Generate "Sandbox" users for testing.
  * In the [playPORTAL Studio](https://studio.playportal.io), click on "Sandbox" in the left navigation pane.
  * Here you can generate different types of "Sandbox Users" so you can log in to your app and try it out.
  * "Sandbox Users" can be of type "Adult", "Parent", or "Child".
  * You can also create friendships between the users using the dropdowns in each "profile preview".

* ### For futher information run any of the playPORTAL Hello World Apps that use the playPORTAL JavaScript SDK.
  * playPORTAL Hello World For React Native (Coming Soon!)
  * playPORTAL Hello World For NodeJS (Coming Soon!)



----

## Making calls into the PPSDK plugin.

### SSO Login / Authentication
The SSO login validates a single user (player) against the playPORTAL. Players may log in with a valid playPORTAL set of credentials. If they've previously logged in, then they can continue to operate as a logged in user.

The PPconfigure method is used to initiate this process. In conjunction with your UserListener function, the app can either:
- if user is currently un-authorized, log a user in via SSO, and then allow full use of the playPORTAL SDK
- if user is currently authorized, silently log in (no user interaction) and then allow full use of the playPORTAL SDK


To support this process, first define a UserListener function that will be invoked on change of Auth status.

```
  export const UserListener = (u, authUpdate) => {
	console.log("UserListener invoked on user:", JSON.stringify(userprofile) +" auth status:"+ authUpdate);
	authenticated = authUpdate;
	if(authenticated == true) {
	    userprofile = u; // save user profile for display, etc
	} else {
	   // display modal with login button or redirect to SSO login
	   ssoUrl = PPgetLoginRoute(); // URL for SSO login is here


	}
  }
```


Then, configure the SDK. The parameters are as described previously. This call does the configuration and starts the auth process. The UserListener will be invoked with auth status.
```
	PPconfigure(cid, cse, redir, ["SANDBOX" | "PRODUCTION"]);  // last parm, environment is optional. defaults to "SANDBOX"
```
--

### User / Friends
The SDK provides methods for accessing a user's profile and a user's friends profiles.

The user's profile is returned to the UserListener, when the user is "auth'd". The user profile contains the following properties:


* #### Get Friends
This method will return a list of this user's friends (with profile for each friend).

	PPgetFriends()
	parms:
		None
	returns:
	    	A promise that will resolve on success to the list of this user's friends, and on error, to the error status.

```
  PPgetFriends()
    .then((response) => {
      console.log("friends:", JSON.stringify(response));
    })
    .catch((error) => {
      console.error(error);
    })
```

### Data
The SDK provides a simple Key Value (KV) store. On login, two data stores are opened / created for this user. There is a private data store for this users exclusive use, and a global data store this user shares with all other users of this same app. If a user logs out and logs in at a later date, the data in the private data store will be as left upon logout. The contents of the global data store will most likely have changed based on write operation of other users.


* #### Write Data
This method will write a KV pair to the referenced data store. If a key is used more than once for writing, the 	value associated with the key will be updated and reflect the most recent write operation.

	PPwriteData(bucketname, key, value)
	parms:
		bucketname - the name of the data store (string). To use one of the pre-defined buckets (one private, one app global) this method can be called with PPgetMyBucketName(p) where p is boolean (true = my private, false = app global)
		key - a key to associate with this data (string)
		value - value to store (JSON.stringify'able JSON, e.g. objects w/o functions)
	returns:
	    	A promise that will resolve to indicate the success/error status of the write operation.

>	Example: to write { somekey : somevalue } to your application private data store:
```
	PPwriteData(PPgetMyBucketName(true), somekey, somevalue)
	.then((response) => {
	      console.log("KV written K:", somekey + " V:" + JSON.stingify(somevalue));
	 })
	.catch((error) => {
	     console.error(error);
	 })
```


* ####  Read data
This method will read a value from the bucket named <i>bucketname</i> for the Key <i>key</I>. It returns a promise 	that will either contain JSON data (on success) or an error.

	PPreadData(bucket, key)
	parms:
		bucketname - the name of the data store (string) or use the PPgetMyBucketName(boolean)
		key - the key to read data from (string)

	returns:
	    	A promise that will resolve on success to a response containing the profiles of the user's friends and on failure an error indicating the error status.

>	Example: to read { somekey } from your application global app data store:

```
	PPreadData(PPgetMyBucketName(false), somekey)
	.then((response) => {
	      console.log("KV read K:", somekey + " V:" + JSON.stringify(response));
	 })
	.catch((error) => {
	     console.error(error);
	 })
```


* ####  Create bucket
The user may also create additional data stores as necessary. That is done as:

	PPcreateBucket(bucketname, users[], ispublic)
	parms:
		bucketname - the name of the data store (string)
		users - CSV array of user ids
		ispublic - non-zero / non-null creates a public bucket

	returns:
	    	A promise that will resolve on success to a response containing the newly created bucket's metadata and on failure an error indicating the error status.

> Example: create a new bucket named "gamescores" that is accessible by any app user
```



	PPcreateBucket('gamescores', [], true)
	.then((response) => {
	      console.log("new bucket created: ", newbucket);
	 })
	.catch((error) => {
	     console.error(error);
	 })
```

For subsequent reads/writes to this new bucket, the same name should be utilized as the bucketname, e.g. <i>gamescores</i>.
