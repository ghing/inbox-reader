/* global gapi */
import Emitter from './emitter';

/**
 * Class to encapsulate Google APIs Client Library for browser JavaScript, aka gapi.
 *
 * This allows for calling code to call a single, simpler API instead of being
 * a mess of callbacks and calls to `gapi` methods.
 *
 * It handles:
 *
 * - Loading and initializing the script.
 * - Authentication flow.
 * - Fetching GMail messages.
 *
 * @fires GoogleApi#signin
 * @fires GoogleApi#signout
 *
 */
class GoogleApi extends Emitter {
  constructor() {
    super();

    this.signedIn = false; 

    this.api = new Promise((resolve) => {
      const script = document.createElement('script');
      // No need to set deferred or async attributes because these are automatic for script elements created using JavaScript.
      script.setAttribute('src', 'https://apis.google.com/js/api.js');
      script.onload = resolve;
      document.body.appendChild(script);
    }).then(() => {
      gapi.load('client:auth2', async () => {
        await gapi.client.init({
          // These credentials are replaced with environment variables by rollup
          // eslint-disable-next-line no-undef
          clientId: __GOOGLE_CLIENT_ID__,
          // eslint-disable-next-line no-undef
          apiKey: __GOOGLE_API_KEY__,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
          scope: 'https://www.googleapis.com/auth/gmail.readonly'
        });

        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignIn.bind(this));

        // Handle the initial sign-in state.
        this.updateSignIn(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    });
  }

  /**
   * Callback for updates to Google sign-in status.
   */
  updateSignIn(isSignedIn) {
    this.signedIn = isSignedIn;
    if (this.signedIn) {
      /**
       * Sign-in event.
       *
       * @event GoogleApi#signin
       */
      this.fire('signin');
    } else {
      /**
       * Sign-out event.
       *
       * @event Google#Api#signout
       */
      this.fire('signout');
    }
  }

  /**
   * Initiate the Google sign-in flow.
   */
  async signIn() {
    await this.api;

    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   * Returns current sign-in status.
   *
   * @returns {bool} true if signed in, false if not.
   */
  isSignedIn() {
    return this.signedIn;
  }

  async getMessages() {
    await this.api;

    if (!this.signedIn) {
      return {};
    }

    let response = await gapi.client.gmail.users.messages.list({
      userId: 'me',
      q: 'newer_than:5d label:foia'
    });

    const batch = gapi.client.newBatch();
    response.result.messages.forEach((msg) => {
      batch.add(
        gapi.client.gmail.users.messages.get({
          userId: 'me',
          id: msg.id
        })
      );
    });

    response = await batch;
    return Object.values(response.result).reduce((msgLookup, msg) => {
      const updated = {
        ...msgLookup
      };

      updated[msg.result.id] = msg.result;

      return updated;
    }, {});
  }
}

export default new GoogleApi();
