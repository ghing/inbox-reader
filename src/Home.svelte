<script>
  import MessageList from './MessageList.svelte';

  export let messages = [];
</script>

<MessageList messages={messages} on:signin />
