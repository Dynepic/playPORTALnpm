'use strict';
import { AsyncStorage} from 'react-native';
import axios from 'axios';

const PPUser = require('./PPUserService');
const PPData = require('./PPDataService');
const APIURLs = require('../utils/APIURLs');
const withAccessToken = require('../utils/request');
var async = require('async');
var Promise = require('promise');

var ppClient = {};
var ppUser = {};
var ppAuth = {};

let userListener;

const _bucketName = (isPrivate) => {
  if(!isPrivate) {
    return "globalAppData" + "@" + ppClient.redirectURI.split(':')[0];
  } else {
    return ppUser.handle + "@" + ppClient.redirectURI.split(':')[0];
  }
}
// ---------------------------
// extern methods
export const PPgetBucketName = (isPrivate) =>  {  return _bucketName(isPrivate);}
export const PPcreateBucket = (bucketname, users, isPublic) => { return PPD.createBucket(bucketname, users, isPublic);}
export const PPwriteData = (bucketname, k, v) =>  {  return PPData.writeBucket(bucketname, k, v);}
export const PPreadData = (bucketname, k) =>  {  return PPData.readBucket(bucketname, k); }
export const PPgetAccessToken = () => {  return ppAuth.accessToken; }
export const PPgetRefreshToken = () => { return ppAuth.refreshToken; }
export const PPgetEnvironment = () => { return environment; }
export const PPlogout = () => { logout(); }
// ----------------------------------------------------------------------------
// PPconfigure
// Called to configure and start the sdk. If "userListener" is registered it
// be called with authentiation status (logged in or not) and user info
// ----------------------------------------------------------------------------
export const PPconfigure =  (id, sec, redir, env) => {
  ppClient.id = id;
  ppClient.secret = sec;
  ppClient.redirectURI = redir;
  ppClient.environment = env;
  ppAuth = {accessToken: "unknown", refreshToken: "unknown", expirationTime: Date.now(), status:false },

  getAuthPrefs()
  .then((response) => {
    refreshAccessToken((parms) => {
      if((parms.refreshToken != "") && (parms.refreshToken != "unknown")) {
        PPUser.getProfile()
        .then((response) => {
          ppUser = response;
          let bu=[];
          if(userListener) userListener(response, ppAuth.status);
          PPData.createBucket(_bucketName(true), bu, true)
          .then((response) => {
            // optionally return contents
          })
          .catch((error) => {
            console.error("join global app data error: " + error);
          });

          bu.push(ppUser.userId);
          PPData.createBucket(_bucketName(false), bu, false)
          .then((response) => {
            // optionally return contents
          })
          .catch((error) => {
            console.error("create private data store error: " + error);
          });

          if(userListener) userListener(response, ppAuth.status);
          setAuthPrefs(ppAuth);
        });
      } else {
        if(userListener) userListener(ppUser, ppAuth.status);
      }
    });
  });
}

export const PPgetLoginRoute = () => {
  return APIURLs.base(`oauth`) + '/signin?client_id=' + ppClient.id + '&redirect_uri=' + ppClient.redirectURI + '&state=beans' + '&response_type=implicit';
};
export const PPaddUserListener = (u) => { userListener = u; };

export const PPhandleOpenURL = (navigation) => {
  ppAuth.status = true;
  ppAuth.accessToken = navigation.getParam('access_token', 'unknown');
  ppAuth.refreshToken = navigation.getParam('refresh_token', 'unknown');
  ppAuth.expirationTime = new Date();
  if(navigation.getParam('expires_in', 'unknown') == "1d") {
    ppAuth.expirationTime.setHours(ppAuth.expirationTime.getHours() + 12)
  } else {
    ppAuth.expirationTime.setHours(ppAuth.expirationTime.getHours() + 1)
  }
  // get user profile info and open buckets
  PPUser.getProfile()
  .then((response) => {
    ppUser = response;
    if(userListener) userListener(response, ppAuth.status);
    let bu=[];
    PPData.createBucket(_bucketName(true), bu, true)
    .then((response) => {
      // optionally return existing contents
    })
    .catch((error) => {
      console.error("join global app data error: " + error);
    });

    bu.push(ppUser.userId);
    PPData.createBucket(_bucketName(false), bu, false)
    .then((response) => {
      // optionally return existing contents
    })
    .catch((error) => {
      console.error("create private data store error: " + error);
    });

    if(userListener) userListener(response, ppAuth.status);
  });
  setAuthPrefs(ppAuth); // save server tokens, etc.
};

export const PPgetFriends = () => {
  return PPUser.getFriendsProfiles()
};

const refreshAccessToken = async (cb) => {
  await axios({
    method: 'post',
    url: APIURLs.base(`oauth`) + '/token',
    params: {
      'client_id': ppClient.id,
      'client_secret' : ppClient.secret,
      'refresh_token': ppAuth.refreshToken,
      'grant_type': "refresh_token"
    },
  })
  .then((response) => {
//    console.log("refresh response:", response);
    ppAuth.status = true;
    ppAuth.accessToken = response.data.access_token;
    ppAuth.refreshToken = response.data.refresh_token;
    const expires_in = response.data.expires_in;
    ppAuth.expirationTime = new Date();
    if (expires_in == "1d") {
      ppAuth.expirationTime.setHours(ppAuth.expirationTime.getHours() + 12)
    } else {
      ppAuth.expirationTime.setHours(ppAuth.expirationTime.getHours() + 1)
    }
    if(cb) cb(response.data);
  })
};

const clearAuth = () => {
  ppAuth.accessToken = "";
  ppAuth.refreshToken = "";
  ppAuth.expirationTime = Date();
  ppAuth.status = false;
  ppUser.userId = "";
  setAuthPrefs(ppAuth);
}
const logout = () => { clearAuth(); };

const getAuthPrefs = async () => {
  await AsyncStorage.getItem('@auth', (err, result) => {
    if(err) {
      console.error("getAuthPrefs error:" + err + " result:"+ result);
      clearAuth();
      reject("Error: getAuthPrefs - " + err);
    } else {
      if(result) ppAuth = JSON.parse(result);
      return(ppAuth);
    }
  });
};

const setAuthPrefs = async () => {
  AsyncStorage.setItem('@auth', JSON.stringify(ppAuth), (err) => {
    if(err) console.error(err);
    return true;
  });
};

const PPManager = {
};
export default PPManager;
