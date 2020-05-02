<script>
  /* global gapi */
  import router from 'page';

  import Home from './Home.svelte';

  let page;
  let props;

  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      gapi.client.gmail.users.messages.list({
        userId: 'me',
        q: 'newer_than:5d label:foia'
      }).then((response) => {
        const batch = gapi.client.newBatch();
        response.result.messages.forEach((msg) => {
          batch.add(
            gapi.client.gmail.users.messages.get({
              userId: 'me',
              id: msg.id
            })
          );
        });

        batch.then((response) => {
          const messages = Object.values(response.result).map(r => r.result);
          props = {
            ...props,
            messages,
            signedIn: isSignedIn 
          };
        });
      });
    } else {
      props = {
        ...props,   
        signedIn: isSignedIn
      };
    }
  }

  function initGapi() {
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

  function handleGapiLoad() {
    gapi.load('client:auth2', initGapi);
  }

  function handleSignIn() {
    gapi.auth2.getAuthInstance().signIn();
  }


  // Set up the pages to watch for
  // See https://jackwhiting.co.uk/posts/setting-up-routing-in-svelte-with-pagejs/ for more on routing.
  router('/', () => page = Home);

  // Set up the router to start and actively watch for changes
  router.start();
</script>

<svelte:head>
  <script async defer src="https://apis.google.com/js/api.js" on:load={handleGapiLoad}>
  </script>
</svelte:head>

<svelte:component this={page} on:signin={handleSignIn} {...props} />
