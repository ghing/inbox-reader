<script>
  export let activeMessage = null;
</script>

<div>
{#if activeMessage}
{activeMessage.id}
{/if}
</div>
