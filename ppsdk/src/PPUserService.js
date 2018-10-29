'use strict';
var axios = require('axios');
var APIURLs = require('../utils/APIURLs');
var PPRequest = require('../utils/request');
import { PPgetAccessToken } from '../src/PPManager';

// Disable logging
//var console = {};
//console.log = function(){};

export const getProfile = () => {
  return new Promise((resolve, reject) => {
  	axios({
        method:'get',
		    url: APIURLs.User.my.profile,
        headers: PPRequest.withAccessToken(),
      })
      .then((response) => {
        console.log("getProfile:", response);
        resolve(response.data);
      })
      .catch((error) => {
        reject("Error: axios - " + error);
      });
		})
};


// GET request for user's image
export const getProfileOrCoverImageURL = (isProfile) => {
  var tag = "cover"
  if(isProfile) { tag = "picture" }
  return APIURLs.User.my.profile + "/" + tag + "?authorization=Bearer " + PPgetAccessToken()
}

export const getFriendProfileImageURL = (imageId) => {
  console.log("get friend image url:", APIURLs.Image.static + imageId + "?authorization=Bearer " + PPgetAccessToken());
  return APIURLs.Image.static + imageId + "?authorization=Bearer " + PPgetAccessToken()
}

export const getFriendsProfiles = () => {
	return new Promise((resolve, reject) => {
	  	axios({
					method:'get',
			    url: APIURLs.User.my.friends,
	        headers: PPRequest.withAccessToken(),
	      })
	      .then((response) => {
	        console.log("getFriendsProfiles:", response);
	        resolve(response.data);
	      })
	      .catch((error) => {
	        reject("Error: axios - " + error);
	      });
		})
};


const PPUserService = {
};

export default PPUserService;
