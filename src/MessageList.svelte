<script>
import MessageListMessage from './MessageListMessage.svelte';
import SignInButton from './SignInButton.svelte';
import { signedIn } from './stores';

export let messages = [];
</script>

<ul>
  {#if $signedIn}
  {#each messages as msg}
  <MessageListMessage message={msg} />
  {/each}
  {:else}
  <SignInButton on:signin />
  {/if}
</ul>
