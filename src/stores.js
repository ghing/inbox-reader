import { derived, readable, writable } from 'svelte/store';

import GoogleApi from './gapi';

export const signedIn = readable(false, (set) => {
  const updateSignedIn = async () => {
    set(GoogleApi.isSignedIn());
  };

  GoogleApi.on('signin', updateSignedIn);
  GoogleApi.on('signout', updateSignedIn);

  // If I ever implement some kind of polling to refresh messsages, subscribe
  // appropriately here.

  // Return the stop function tat is called when the last subscriber unsubscribes.
  return () => {
    GoogleApi.off('signin', updateSignedIn);
    GoogleApi.off('signout', updateSignedIn);
  };
});

const messages = derived(
  signedIn,
  async ($signedIn, set) => {
    const msgs = await GoogleApi.getMessages();
    set(msgs);
  }
);

export const messageList = derived(
  messages,
  ($messages) => {
    if (!$messages) {
      return [];
    }
    const ml = Object.values($messages);
    return ml;
  }
);

export const requestedActiveMessageId = writable(null);

export const activeMessage = derived(
  [messages, requestedActiveMessageId],
  ([$messages, $requestedActiveMessageId]) => {
    if (!$messages || !$requestedActiveMessageId) {
      return null;
    }

    return $messages[$requestedActiveMessageId];
  }
);
