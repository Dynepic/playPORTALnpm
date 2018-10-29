# Changelog
All notable changes to the playPORTAL npm project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

----
### 0.1.6 - 2018-08-26
##### Changed
- The server domains for DEV, SANDBOX and PRODUCTION moved; the SDK changed to support these new URLs.
- Re-added previous signatures for convenience methods that retrieve user's bucket names

##### Added
- On refresh access token failure with 4xx, UserListener is invoked with auth status false. On detection of this, the UserListener should present the SSO login page to the app user, since no further API calls will be successful until re-authentication.

### 0.1.5 - 2018-07-22
##### Changed
- Improved descriptions for using data buckets.
- Minor code cleanup


### 0.1.4 - 2018-07-19
##### Added
- Improved instructions for setting up your first app.
- Added doc section for using SDK methods

##### Changed
- Added PPbucketCreate() method
- Added methods for getting and using private app data and global app data
- Brought CHANGELOG up to date


### 0.1.3 - 2018-07-18
##### Changed
- Fixed bugs in core SDK


## 0.1.2 - 2018-07-18
### Changed
- Improved README


### 0.1.1 - 2018-07-18
##### Changed
- Change license from ISC to APACHE-2.0


### 0.0.3 - 2018-07-12
##### Changed
- Fixed bug when returning user profile.


### 0.0.2 - 2018-07-11 . Initial Release
##### Added

- Initial version of SDK
- Core functionality for
  - SSO using playPORTAL Auth gateway
  - User profile
  - Friends profiles
  - Reading/Writing data in Lightning db

----

### Unreleased
##### 0.1.0
##### 0.0.1
