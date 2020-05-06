<script>
  /* global gapi */
  import router from 'page';

  import Home from './Home.svelte';
  import Message from './Message.svelte';
  import { handleSignIn, initGapi } from './gapi';
  import { activeMessage, messageList, signedIn , requestedActiveMessageId } from './stores';

  let page;
  let props = {
    messages: []
  };

  messageList.subscribe((ml) => {
    props = {
      ...props,
      messages: ml
    };
  });

  activeMessage.subscribe((msg) => {
    props = {
      ...props,
      activeMessage: msg
    };
  });

  function updateSigninStatus(isSignedIn) {
    signedIn.set(isSignedIn);
  }

  function handleGapiLoad() {
    gapi.load('client:auth2', () => initGapi(updateSigninStatus));
  }

  // Set up the pages to watch for
  // See https://jackwhiting.co.uk/posts/setting-up-routing-in-svelte-with-pagejs/ for more on routing.
  router('/', () => page = Home);

  router(
    '/messages/:id',
    (ctx, next) => {
      requestedActiveMessageId.set(ctx.params.id);
      next();
    },
    () => page = Message
  );

  // Set up the router to start and actively watch for changes
  router.start();
</script>

<svelte:head>
  <script async defer src="https://apis.google.com/js/api.js" on:load={handleGapiLoad}>
  </script>
</svelte:head>

<main>
  <svelte:component on:signin={handleSignIn} this={page} {...props} />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
