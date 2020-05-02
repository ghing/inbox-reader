/**
 * Abandoned Microsoft Graph API code.
 *
 * I'm keeping this here for now in the event that I can get permissions
 * for my app to access mail. However, I don't have that right now.
 *
 * This is based on the quickstart guides at:
 *
 * [Build JavaScript single-page apps with Microsoft Graph - Microsoft Graph | Microsoft Docs](https://docs.microsoft.com/en-us/graph/tutorials/javascript)
 * and
 * [microsoftgraph/msgraph-sdk-javascript: Microsoft Graph client library for JavaScript](https://github.com/microsoftgraph/msgraph-sdk-javascript)
 *
 */

import { UserAgentApplication } from 'msal';
import { Client } from '@microsoft/microsoft-graph-client';
import { ImplicitMSALAuthenticationProvider } from '@microsoft/microsoft-graph-client/lib/src/ImplicitMSALAuthenticationProvider';
import { MSALAuthenticationProviderOptions } from '@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions';

const msalConfig = {
  auth: {
    clientId: '9a5b420d-6d39-403f-994f-5c459997d41c',
    redirectUri: 'http://localhost:5000',
    // This is needed in order to log into company 
    authority: 'https://login.microsoftonline.com/common'
  },
  // Note sure if this is needed. This was in the tutorial.
  /*
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
    forceRefresh: false
  }
  */
};

const graphScopes = [
  'openid',
  'profile',
  'user.read',
  // This requires admin permissions. This is the hangup of why I didn't go this route.
  //'mail.read'
];

const loginRequest = {
  scopes: graphScopes
};

// Important Note: This library implements loginPopup and acquireTokenPopup flow, remember this while initializing the msal
// Initialize the MSAL @see https://github.com/AzureAD/microsoft-authentication-library-for-js#1-instantiate-the-useragentapplication
const msalApplication = new UserAgentApplication(msalConfig);
const options = new MSALAuthenticationProviderOptions(graphScopes);
const authProvider = new ImplicitMSALAuthenticationProvider(msalApplication, options);

/**
 * Login and return a client capable of making Graph API requests.
 */
export async function getClient() {
  // Login
  
  try {
    await msalApplication.loginPopup(loginRequest);
 
    const options = {
      authProvider, // An instance created from previous step
    };

    return Client.initWithMiddleware(options);
  } catch (error) {
    console.log(error);
  }
}

