<script>
import MessageListMessage from './MessageListMessage.svelte';

export let messages = [];
</script>

<ul>
  {#each messages as msg}
  <MessageListMessage message={msg} />
  {/each}
</ul>
