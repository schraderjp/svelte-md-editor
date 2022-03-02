import { writable } from 'svelte/store';

function getText() {
  let storedText = localStorage.getItem('md-editor-svelte');
  if (storedText) return storedText;
  localStorage.setItem('md-editor-svelte', '');
  return storedText;
}

export const editor = writable(null);
export const model = writable(null);
export const value = writable(getText());
