'use strict';
const { AsyncStorage } = require('react-native');
const axios = require('axios');
const URL = require('url-parse');
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
export const PPgetMyBucketName = (isPrivate) =>  {  return _bucketName(isPrivate);}
export const PPgetBucketName = (isPrivate) =>  {  return _bucketName(isPrivate);}
export const PPcreateBucket = (bucketname, users, isPublic) => { return PPD.createBucket(bucketname, users, isPublic);}
export const PPwriteData = (bucketname, k, v) =>  {  return PPData.writeBucket(bucketname, k, v);}
export const PPreadData = (bucketname, k) =>  {  return PPData.readBucket(bucketname, k); }
export const PPgetAccessToken = () => { return ppAuth.accessToken; }
export const PPgetRefreshToken = () => { return ppAuth.refreshToken; }
export const PPgetEnvironment = () => { return environment; }
export const PPlogout = () => { logout(); }
export const PPgetProfileOrCoverImage = (isP) =>  {  return PPUser.getProfileOrCoverImage(isP); }
export const PPgetProfileOrCoverImageURL = (isP) =>  {  return PPUser.getProfileOrCoverImageURL(isP); }
export const PPgetFriendProfileImageURL = (imageId) => { return PPUser.getFriendProfileImageURL(imageId); }
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
      ppAuth = response
      if(ppAuth.status) {
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
      } else {
        if(userListener) userListener(ppUser, ppAuth.status);
      }
    });
}

export const PPgetLoginRoute = () => {
  console.log("PPgetLoginRoute: ",  APIURLs.base(`oauth`) + '/signin?client_id=' + ppClient.id + '&redirect_uri=' + ppClient.redirectURI + '&state=beans' + '&response_type=implicit')
    return APIURLs.base(`oauth`) + '/signin?client_id=' + ppClient.id + '&redirect_uri=' + ppClient.redirectURI + '&state=beans' + '&response_type=implicit';
};
export const PPaddUserListener = (u) => { userListener = u; };

export const PPhandleOpenURL = (navigation) => {
  ppAuth.status = true;
  ppAuth.accessToken = navigation.getParam('access_token', 'unknown');
  ppAuth.refreshToken = navigation.getParam('refresh_token', 'unknown');
  ppAuth.expirationTime = new Date();
  if(navigation.getParam('expires_in') === "1d") {
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
  try {
    const response = await axios({
      method: 'post',
      url: APIURLs.base(`oauth`) + '/token',
      params: {
        'client_id': ppClient.id,
        'client_secret' : ppClient.secret,
        'refresh_token': ppAuth.refreshToken,
        'grant_type': "refresh_token"
      },
      validateStatus:  (status) => {
        return status >= 200 && status < 300; // default
        if((status >= 400) && (status < 500) && userListener) userListener(null, false);
      },
    })

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
  } catch (err) {
    console.error("refreshAccessToken error:" + err)
  }
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
  try {
    const result = await AsyncStorage.getItem('@auth')
    const auth = JSON.parse(result);
    console.log("getAuthPrefs auth:", auth);
    return auth;
  } catch (err) {
    console.error("getAuthPrefs error:" + err);
    clearAuth();
  }
};

const setAuthPrefs = async () => {
  try {
    await AsyncStorage.setItem('@auth', JSON.stringify(ppAuth))
  } catch (e) {
    console.error("setAuthPrefs error:" + err);
  }
};

const PPManager = {
};
export default PPManager;
