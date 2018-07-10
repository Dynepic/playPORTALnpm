/*
 * Utils for service requests
 */

import { PPgetAccessToken, PPgetRefreshToken } from '../src/PPManager';

/* Request Decorators ==================================================================== */
const withAccessToken = headers => ({
  ...headers,
  authorization: `Bearer ${PPgetAccessToken()}`,
});

const withRefreshToken = body => ({
  ...body,
  refresh_token: PPgetRefreshToken(),
});

/* Export ==================================================================== */
export {
  withAccessToken,
  withRefreshToken,
};
