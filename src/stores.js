/* global gapi */
import { derived, writable } from 'svelte/store';

export const signedIn = writable(false);

export const messages = derived(signedIn, ($signedIn, set) => {
  if (!$signedIn) {
    set(null);
    return;
  }

  gapi.client.gmail.users.messages.list({
    userId: 'me',
    q: 'newer_than:5d label:foia'
  }).then((response) => {
    const batch = gapi.client.newBatch();
    response.result.messages.forEach((msg) => {
      batch.add(
        gapi.client.gmail.users.messages.get({
          userId: 'me',
          id: msg.id
        })
      );
    });

    batch.then((response) => {
      set(Object.values(response.result).reduce((msgLookup, msg) => {
        const updated = {
          ...msgLookup
        };

        updated[msg.result.id] = msg.result;

        return updated;
      }, {}));
    });
  });
}); 

export const messageList = derived(
  messages,
  ($messages) => {
    if ($messages === null) {
      return [];
    }
    
    return Object.values($messages);
  } 
);

export const requestedActiveMessageId = writable(null); 

export const activeMessage = derived(
  [messages, requestedActiveMessageId],
  ([$messages, $requestedActiveMessageId]) => {
    if ($messages === null || $requestedActiveMessageId === null) {
      return null;
    }

    return $messages[$requestedActiveMessageId];
  }
);
