'use strict';
var axios = require('axios');
var APIURLs = require('../utils/APIURLs');
var PPRequest = require('../utils/request');


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
