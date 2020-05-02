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
    headers: parseHeaders(msg.payload.headers),
    snippet: unescape(msg.snippet)
  };
}

const processedMessage = processMessage(message);
</script>

<li>
  <span class="sender">{processedMessage.headers['From']}</span>
  <span class="subject">{processedMessage.headers['Subject']}</span>
  <span class="snippet">{processedMessage.snippet}</span>
</li>
