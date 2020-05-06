<script>
  import router from 'page';

  import Home from './Home.svelte';
  import Message from './Message.svelte';
  import { activeMessage, messageList, requestedActiveMessageId, signedIn } from './stores';
  import GoogleApi from './gapi';

  let page;

  function handleSignIn() {
    GoogleApi.signIn();
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

<main>
  <svelte:component on:signin={handleSignIn} this={page} signedIn={$signedIn} messages={$messageList} activeMessage={$activeMessage} />
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
