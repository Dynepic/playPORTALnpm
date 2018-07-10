/*
 * APIURLS - contains urls for api calls
 */

import env, { DEBUG, STAGING, RELEASE } from './env';

export const base = (slug) => {
  switch (env) {
    case DEBUG:
        default:
      return `https://sandbox.iokids.net/${slug}`;
    case RELEASE:
      return `https://goplayportal.com/${slug}`;
  }
};

const urlScheme = () => {
  return 'playportal://';
};

//  User URLs
export const User = {};
User.base = base('user');
User.my = {};
User.my.base = `${User.base}/v1/my`;
User.my.profile = `${User.my.base}/profile`;
User.my.picture = `${User.my.profile}/picture`;
User.my.cover = `${User.my.profile}/cover`;
User.my.friends = `${User.my.base}/friends`;
User.kids = {};
User.kids.base = `${User.base}/v1/kids`;

export const Data = {};
Data.base = `${base('app')}/v1/bucket`;

//  App URLs
const App = {};
App.base = `${base('app')}/v1`;
App.data = `${App.base}/data`;

//  ImageEdit URLs
const Image = {};
Image.base = `${base('image')}/v1`;
Image.static = `${Image.base}/static`;

console.log("App Server Routes: ", App);
console.log("User Server Routes: ", User);

export default {
//  User,
  App,
  Image,
};
