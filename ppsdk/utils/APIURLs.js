/*
 * APIURLS - contains urls for api calls
 */

var env = "DEV";
export const configureEnv = (e) => { env = e; }

export const base = (slug) => {
  switch (env) {
    case "SANDBOX":
    default:
      return `https://sandbox.playportal.io/${slug}`;
    case "PRODUCTION":
      return `https://api.playportal.io/${slug}`;
    case "DEV":
      return `https://develop-api.goplayportal.com/${slug}`;
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
export const Image = {};
Image.base = base('image');
Image.static = `${Image.base}/v1/static/`;

console.log("App Server Routes: ", App);
console.log("User Server Routes: ", User);
console.log("Image Server Routes: ", Image);

export default {
//  User,
  App,
};
