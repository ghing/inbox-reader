import { writable } from 'svelte/store';

export const client = writable(null);

export const messages = writable([]);

export const signedIn = writable(false);
