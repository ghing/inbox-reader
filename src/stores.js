import { derived, writable } from 'svelte/store';

export const messages = writable({});

export const messageList = derived(
  messages,
  $messages => Object.values($messages)
);
