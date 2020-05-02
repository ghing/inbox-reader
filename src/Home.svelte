<script>
import { createEventDispatcher } from 'svelte';

import MessageList from './MessageList.svelte'; 

export let signedIn;
export let messages = [];

const dispatch = createEventDispatcher();

async function handleClickSignIn() {
  dispatch('signin', true);
}

</script>

<main>
  {#if signedIn}
  <p>Logged in</p>
  {:else}
  <button on:click={handleClickSignIn}>Sign In</button>
  {/if}
  
  <MessageList messages={messages} />
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
