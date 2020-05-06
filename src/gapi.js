/* global gapi */
export function initGapi(updateSigninStatus) {
  gapi.client.init({
    // These credentials are replaced with environment variables by rollup
    // eslint-disable-next-line no-undef
    clientId: __GOOGLE_CLIENT_ID__,
    // eslint-disable-next-line no-undef
    apiKey: __GOOGLE_API_KEY__,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
    scope: 'https://www.googleapis.com/auth/gmail.readonly'
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

export function handleSignIn() {
  gapi.auth2.getAuthInstance().signIn();
}
