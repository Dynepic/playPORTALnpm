//'use strict';
import { AsyncStorage} from 'react-native';
import axios from 'axios';

const PPUser = require('./PPUserService');
const PPData = require('./PPDataService');
const APIURLs = require('../utils/APIURLs');
const withAccessToken = require('../utils/request');
var async = require('async');
var Promise = require('promise');

var nvstore;

var clientId="";
var clientSecret="";
var redirectURI="";
var environment="SANDBOX";
var authStatus = false;
var setImAnonymousStatus = false;
var friends = [];
var ppsdkUserParms = {};
var ppsdkAuthParms = {};

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
export const PPgetBucketName = (isPrivate) =>  {  return _bucketName(isPrivate);}
export const PPcreateBucket = (bucketname, users, isPublic) => { return PPD.createBucket(bucketname, users, isPublic);}
export const PPwriteData = (bucketname, k, v) =>  {  return PPData.writeBucket(bucketname, k, v);}
export const PPreadData = (bucketname, k) =>  {  return PPData.readBucket(bucketname, k); }
export const PPgetAccessToken = () => {  return ppsdkAuthParms.accessToken; }
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
  ppsdkAuthParms = {accessToken: "unknown", refreshToken: "unknown", expirationTime: Date.now()  },

  getAuthPrefs()
  .then((response) => {
    refreshAccessToken((parms) => {
          if(parms.refreshToken != "") {
            PPUser.getProfile()
            .then((response) => {
                ppsdkUserParms = response;
                if(userListener) userListener(response, authStatus);
                const bu = [];
                PPData.createBucket(_bucketName(true), bu, true)
                .then((response) => {
                  // optionally return contents
                })
                .catch((error) => {
                  console.error("join global app data error: " + error);
                });

                bu.push(ppsdkUserParms.userId);
                PPData.createBucket(_bucketName(false), bu, false)
                .then((response) => {
                  // optionally return contents
                })
                .catch((error) => {
                  console.error("create private data store error: " + error);
                });

                setUserPrefs()
                .then(() => {
                  if(userListener) userListener(response, authStatus);
                });
                setAuthPrefs(ppsdkAuthParms)
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
      if(userListener) userListener(response, authStatus);
      const bu = [];
      PPData.createBucket(_bucketName(true), bu, true)
      .then((response) => {
        // optionally return existing contents
      })
      .catch((error) => {
        console.error("join global app data error: " + error);
      });

      bu.push(ppsdkUserParms.userId);
      PPData.createBucket(_bucketName(false), bu, false)
      .then((response) => {
        // optionally return existing contents
      })
      .catch((error) => {
        console.error("create private data store error: " + error);
      });

      setUserPrefs()
      .then(() => {
        if(userListener) userListener(response, authStatus);
      });
  });
    setAuthPrefs(ppsdkAuthParms); // save server tokens, etc.
};

export const PPgetFriends = () => {
    return PPUser.getFriendsProfiles()
};

const refreshAccessToken = async (cb) => {
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

const logout = () => {
  ppsdkAuthParms.accessToken = "";
  ppsdkAuthParms.refreshToken = "";
  ppsdkUserParms.userId = "";
  setAuthPrefs();
  setUserPrefs();
};

const AnonymousLogin = () => {
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
        if(result) {
          ppsdkAuthParms = JSON.parse(result);
        }
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

const getUserPrefs = async () => {
   AsyncStorage.getItem('@ppsdkUserParms', (err, result) => {
    if(err) {
      console.error(err);
      ppsdkUserParms.userId = "unknown";
      ppsdkUserParms.handle = "unknown";
    } else {
      if(result) {
        ppsdkUserParms = JSON.parse(result);
      }
      return ppsdkUserParms
    }
  });
};

const setUserPrefs = async () => {
   AsyncStorage.setItem('@ppsdkUserParms', JSON.stringify(ppsdkUserParms), (err) => {
    if(err) console.error(err);
  });
};

const PPManager = {
};
export default PPManager;
