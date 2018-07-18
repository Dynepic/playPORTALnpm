![](./readmeAssets/wordmark.png)
##### playPORTAL <sup>TM</sup> provides a service to app developers for managing users of all ages and the data associated with the app and the app users, while providing compliance with required COPPA laws and guidelines.

# <b> playPORTAL Javascript SDK</b></br>

## Getting Started

* ### <b>Step 1:</b> Create playPORTAL Partner Account

	* Navigate to [playPORTAL Partner Dashboard](https://partner.playportal.io)
	* Click on <b>Sign Up For Developer Account</b>
	* After creating your account, email us at [info@playportal.io](mailto:info@playportal.io?subject=Developer%20Sandbox%20Access%20Request) to verify your account.
  </br>

* ### <b>Step 2:</b> Register your App with playPORTAL

	* After confirmation, log in to the [playPORTAL Partner Dashboard](https://partner.playportal.io)
	* In the left navigation bar click on the <b>Apps</b> tab.
	* In the <b>Apps</b> panel, click on the "+ Add App" button.
	* Add an icon, name & description for your app.
	* For "Environment" leave "Sandbox" selected.
	* Click "Add App"
  </br>

* ### <b>Step 3:</b> Generate your Client ID and Client Secret

	* Tap "Client IDs & Secrets"
	* Tap "Generate Client ID"
	* The values generated will be used in 'Step 4'.
  </br>

* ### <b>Step 4:</b> Install playPORTAL npm package

  * From the root of your project, install the playPORTAL SDK with:

  ```
  $ npm i playportal
  ```

* ### <b>Step 5:</b> Add Client ID and Client Secret to App
  * Add the following to the "include" section of your App.js (or other main application module).
    * ###### For the purpose of running this HelloWorld app, these keys are in plain text in the file, but for a production app you must store them securely - they uniquely identify your app and grant the permissions to your app as defined in the playPORTAL Partner Dashboard.

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
    ```



* ## <b>Step 6:</b> Run your app.

* ## <b>Step 7:</b> Generate "Sandbox" users for testing.
  * In the [playPORTAL Partner Dashboard](https://partner.playportal.io), click on "Sandbox" in the left navigation pane.
  * Here you can generate different types of "Sandbox Users" so you can log in to your app and try it out.
  * "Sandbox Users" can be of type "Adult", "Parent", or "Child".
  * You can also create friendships between the users using the dropdowns in each "profile preview".

* ### For futher information run any of the playPORTAL Hello World Apps that use the playPORTAL JavaScript SDK.
  * playPORTAL Hello World For React Native (Coming Soon!)
  * playPORTAL Hello World For NodeJS (Coming Soon!)
