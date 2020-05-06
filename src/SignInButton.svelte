<script>
  import { createEventDispatcher } from 'svelte';

  import { signedIn } from './stores';

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('signin', true);
  }
</script>

<div>
  {#if signedIn}
  <p>Signed in</p>
  {:else}
  <button on:click={handleClick}>Sign In</button>
  {/if}
</div>
