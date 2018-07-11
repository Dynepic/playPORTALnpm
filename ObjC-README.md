![](./readmeAssets/wordmark.png)
##### playPORTAL <sup>TM</sup> provides a service to app developers for managing users of all ages and the data associated with the app and the app users, while providing compliance with required COPPA laws and guidelines.

# <b>Hello World - ObjectiveC</b></br>

## Getting Started

* ### <b>Step 1:</b> Create playPORTAL Partner Account

	* Navigate to [playPORTAL Partner Dashboard](https://partner.iokids.net)
	* Click on <b>Sign Up For Developer Account</b>
	* After creating your account, email us at [info@playportal.io](mailto:info@playportal.io?subject=Developer%20Sandbox%20Access%20Request) to verify your account.
  </br>

* ### <b>Step 2:</b> Register your App with playPORTAL

	* After confirmation, log in to the [playPORTAL Partner Dashboard](https://partner.iokids.net)
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

* ### <b>Step 4:</b> Add Client ID and Client Secret to App

	* In "AppDelegate.m" replace the following values with the values generated in 'Step 3'.
		```
		NSString *cid = @"YOUR_CLIENT_ID_HERE";
		NSString *cse = @"YOUR_CLIENT_SECRET_HERE";
		```
		###### For the purpose of running this HelloWorld app, these keys are in plain text in the file, but for a production app you must store them securely - they uniquely identify your app and grant the permissions to your app as defined in the playPORTAL Partner Dashboard.

* ## <b>Step 5:</b> Run the app from XCode.

* ## <b>Step 6:</b> Generate "Sandbox" users for testing.
	* In the [playPORTAL Partner Dashboard](https://partner.iokids.net), click on "Sandbox" in the left navigation pane.
	* Here you can generate different types of "Sandbox Users" so you can log in to your app and try it out.
	* "Sandbox Users" can be of type "Adult", "Parent", or "Child".
	* You can also create friendships between the users using the dropdowns in each "profile preview".
