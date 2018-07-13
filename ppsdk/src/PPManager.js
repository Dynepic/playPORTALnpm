'use strict';
import axios from 'axios';
import semaphore from 'semaphore';

const PPUser = require('./PPUserService');
const PPData = require('./PPDataService');
const APIURLs = require('../utils/APIURLs');
const withAccessToken = require('../utils/request');
var async = require('async');
var Promise = require('promise');
var refreshInProgress = require('semaphore')(1);

var clientId="";
var clientSecret="";
var redirectURI="";
var environment="SANDBOX";
var authStatus = false;
let setImAnonymousStatus = false;
let friends = [];
var ppsdkUserParms={};
var ppsdkAuthParms={};
const nonce = "beans";
const Authbase = APIURLs.base(`oauth`);
const Authlogout = Authbase + '/logout';
const RefreshToken = Authbase + '/token';
let Authtoken = Authbase +
  '/token?redirect_uri=' + redirectURI +
  '&client_id=' + clientId +
  '&client_secret=' + clientSecret;

let userListener;

// Disable logging
var console = {};
console.log = function(){};

// internal convenience methods
const _bucketName = (isPrivate) => {
  if(!isPrivate) {
    return "globalAppData" + "@" + redirectURI.split(':')[0];
  } else {
    return ppsdkUserParms.handle + "@" + redirectURI.split(':')[0];
  }
}

// ---------------------------
// extern methods
export const PPwriteData = (k, v, isPrivate) =>  {  return PPData.writeBucket(_bucketName(isPrivate), k, v);}
export const PPreadData = (k, isPrivate) =>  {  return PPData.readBucket(_bucketName(isPrivate), k); }
export const PPgetAccessToken = () => {
  console.log("getAccessToken:", ppsdkAuthParms.accessToken);
  return ppsdkAuthParms.accessToken;
}
export const PPgetRefreshToken = () => { return ppsdkAuthParms.refreshToken; }
export const PPgetEnvironment = () => { return environment; }
// ------------------------------------------------------------
// PPconfigure is called first by the app to initialize the ppsdk
// If the "userListener" is already registered it will invoke
// it with the authentiation status (logged in or not) and user
// info (if it exists)
// ------------------------------------------------------------
export const PPconfigure =  (id, sec, redir, env) => {
  clientId = id;
  clientSecret = sec;
  redirectURI = redir;
  environment = env;
  authStatus = false;

  getAuthPrefs()
  .then((response) => {
    refreshAccessToken((parms) => {
          console.log("parms:", parms);
          console.log("ppsdkAuthParms:", ppsdkAuthParms);
          if(parms.refreshToken != "") {
            PPUser.getProfile()
            .then((response) => {
                ppsdkUserParms = response;
                console.log("me:", ppsdkUserParms);
                if(userListener) userListener(response, authStatus);
                const bu = [];
                PPData.createBucket(_bucketName(true), bu, true)
                .then((response) => {
                  console.log("join global app data success: " + response);
                })
                .catch((error) => {
                  console.error("join global app data error: " + error);
                });

                bu.push(ppsdkUserParms.userId);
                PPData.createBucket(_bucketName(false), bu, false)
                .then((response) => {
                  console.log("create private data store success: " + response);
                })
                .catch((error) => {
                  console.error("create private data store error: " + error);
                });

                setUserPrefs()
                .then(() => {
                  if(userListener) userListener(response, authStatus);
                });
                setAuthPrefs()
            });
          } else {
            if(userListener) userListener(ppsdkUserParms, authStatus);
          }
        });
  });
}

export const PPgetLoginRoute = () => {
    return Authbase + '/signin?client_id=' + clientId + '&redirect_uri=' + redirectURI + '&state=' + nonce + '&response_type=implicit';
  };
export const PPaddUserListener = (u) => { userListener = u; };

export const PPhandleOpenURL = (navigation) => {
  console.log("PPhandleOpenURL:");
  setImAnonymousStatus = false;
  authStatus = true;

  ppsdkAuthParms.accessToken = navigation.getParam('access_token', 'unknown');
  ppsdkAuthParms.refreshToken = navigation.getParam('refresh_token', 'unknown');
  const expires_in = navigation.getParam('expires_in', 'unknown');
  ppsdkAuthParms.expirationTime = new Date();
  if (expires_in == "1d") {
    ppsdkAuthParms.expirationTime.setHours(ppsdkAuthParms.expirationTime.getHours() + 12)
  } else {
    ppsdkAuthParms.expirationTime.setHours(ppsdkAuthParms.expirationTime.getHours() + 1)
  }
  // get user profile info and open buckets
  PPUser.getProfile()
  .then((response) => {
      ppsdkUserParms = response;
      console.log("me:", ppsdkUserParms);
      if(userListener) userListener(response, authStatus);
      const bu = [];
      PPData.createBucket(_bucketName(true), bu, true)
      .then((response) => {
        console.log("join global app data success: " + response);
      })
      .catch((error) => {
        console.error("join global app data error: " + error);
      });

      bu.push(ppsdkUserParms.userId);
      PPData.createBucket(_bucketName(false), bu, false)
      .then((response) => {
        console.log("create private data store success: " + response);
      })
      .catch((error) => {
        console.error("create private data store error: " + error);
      });

      setUserPrefs()
      .then(() => {
        if(userListener) userListener(response, authStatus);
      });
  });
    setAuthPrefs(); // save server tokens, etc.
};

export const PPgetFriends = () => {
    return PPUser.getFriendsProfiles()
};

const refreshAccessToken = async (cb) => {
  console.log("refreshAccessToken: ");
  await axios({
      method: 'post',
      url: RefreshToken,
      params: {
        'client_id': clientId,
        'client_secret' : clientSecret,
        'refresh_token': ppsdkAuthParms.refreshToken,
        'grant_type': "refresh_token"
      },
    })
    .then((response) => {
      console.log("refresh response:", response);
      authStatus = true;
      ppsdkAuthParms.accessToken = response.data.access_token;
      ppsdkAuthParms.refreshToken = response.data.refresh_token;
      const expires_in = response.data.expires_in;
      ppsdkAuthParms.expirationTime = new Date();
      if (expires_in == "1d") {
        ppsdkAuthParms.expirationTime.setHours(ppsdkAuthParms.expirationTime.getHours() + 12)
      } else {
        ppsdkAuthParms.expirationTime.setHours(ppsdkAuthParms.expirationTime.getHours() + 1)
      }
      if(cb) cb(response.data);
    })
};

const tokensNotExpired = () => {
  const currentDT = new Date();
  return currentDT < ppsdkAuthParms.expirationTime;
};

const logout = () => {
  ppsdkAuthParms.accessToken = null;
  ppsdkAuthParms.refreshToken = null;
  invalidateAuthPrefs();
  invalidateUserPrefs();
};

const AnonymousLogin = () => {
};
const dateTimeFromString = (datestring) => {
  return Date.parse(datestring);
};
const stringFromDateTime = (dateTime) => {
  return dateTime.toString();
};
const getImAnonymousStatus = () => {
  return false;
};


const getAuthPrefs = async () => {
    await AsyncStorage.getItem('@ppsdkAuthParms', (err, result) => {
    if(err) {
        console.error("getAuthPrefs error:" + err + " result:"+ result);
        ppsdkAuthParms.accessToken = "unknown";
        ppsdkAuthParms.refreshToken = "unknown";
        ppsdkAuthParms.expirationTime = Date();
        reject("Error: getAuthPrefs - " + err);
      } else {
        ppsdkAuthParms = JSON.parse(result);
        console.log("getAuthPrefs:", JSON.stringify(ppsdkAuthParms));
        return(ppsdkAuthParms);
      }
    });
//  });
};
const setAuthPrefs = async () => {
   AsyncStorage.setItem('@ppsdkAuthParms', JSON.stringify(ppsdkAuthParms), (err) => {
      if(err) console.error(err);
      return true;
    });
};
const invalidateAuthPrefs = () => {
  console.log("invalidating AuthPrefs :", "");
  ppsdkAuthParms.refreshToken = "unknown";
  ppsdkAuthParms.accessToken = "unknown";
  return setAuthPrefs();
};


const getUserPrefs = async () => {
   AsyncStorage.getItem('@ppsdkUserParms', (err, result) => {
    if(err) {
      console.error(err);
      ppsdkUserParms.userId = "unknown";
      ppsdkUserParms.handle = "unknown";
    } else {
      ppsdkUserParms = JSON.parse(result);
      return ppsdkUserParms
    }
  });
  console.log("getUserPrefs userId:", ppsdkUserParms.userId);
};

const setUserPrefs = async () => {
   AsyncStorage.setItem('@ppsdkUserParms', JSON.stringify(ppsdkUserParms), (err) => {
    if(err) console.error(err);
  });
  console.log("setUserPrefs userId:" + ppsdkUserParms.userId + " handle:" + ppsdkUserParms.handle);
};

const _invalidateUserPrefs = () => {
  console.log("invalidating UserPrefs :", "");
  ppsdkUserParms.userId = "unknown";
  ppsdkUserParms.handle = "unknown";
  setUserPrefs();
};


const PPManager = {
};
export default PPManager;
