<script>
import unescape from 'lodash/unescape';

export let message;

function parseHeaders(headers) {
  return headers.reduce((headerLookup, header) => {
    const updated = {...headerLookup};
    updated[header.name] = header.value;
    return updated;
  }, {});
}

function processMessage(msg) {
  return {
    id: msg.id,
    headers: parseHeaders(msg.payload.headers),
    snippet: unescape(msg.snippet)
  };
}

const processedMessage = processMessage(message);
</script>

<li>
  <a href="/messages/{processedMessage.id}">
    <span class="sender">{processedMessage.headers['From']}</span>
    <span class="subject">{processedMessage.headers['Subject']}</span>
    <span class="snippet">{processedMessage.snippet}</span>
  </a>
</li>
