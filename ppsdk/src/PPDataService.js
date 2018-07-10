'use strict';
var axios = require('axios');
var APIURLs = require('../utils/APIURLs');
var PPRequest = require('../utils/request');

export const createBucket = (bucketName, bucketUsers, isPublic) => {
  return new Promise((resolve, reject) => {
    if(bucketName != null) {
      axios({
        method:'put',
        url: APIURLs.Data.base,
        headers: PPRequest.withAccessToken(),
        data: {
          public : isPublic,
          id : bucketName,
          users : [],
          data: {}
        },
        validateStatus:  (status) => {
          return status >= 200 && status < 300 || status == 409; // default
        },
      })
      .then((response) => {
        console.log("createBucket:", response);
        resolve(response);
      })
      .catch((error) => {
        reject("Error: axios - " + error);
      });
    } else {
      reject("ERROR: " + "null bucketName");
    }
  })
};

export const readBucket = (bucketName, key) => {
  console.log("readBucket: ", bucketName + " and key:" + key);
  return new Promise((resolve, reject) => {
        axios({
          method:'get',
          url: APIURLs.Data.base,
          headers: PPRequest.withAccessToken(),
          params: {
            id : bucketName,
            key : key,
          },
        })
        .then((response) => {
          console.log("readBucket:", response);
          // NB - need add'l level of indirection as our data field is also called data
          resolve(response.data.data);
        })
        .catch((error) => {
          reject("Error: axios - " + error);
        });
    })
	};

export const writeBucket = (bucketName, key, value) => {
	console.log("writeBucket with bucket: " + bucketName + " key:" + key + " value:" + value);
  return new Promise((resolve, reject) => {
      axios({
        method:'post',
        url: APIURLs.Data.base,
        headers: PPRequest.withAccessToken(),
        data: {
          id : bucketName,
          key : key,
          value : value,
        },
      })
      .then((response) => {
        console.log("writeBucket:", response);
        resolve(response);
      })
      .catch((error) => {
        reject("Error: axios - " + error);
      });
    })
  };




const PPDataService = {
  createBucket,
  readBucket,
  writeBucket,
  };
export default PPDataService;
