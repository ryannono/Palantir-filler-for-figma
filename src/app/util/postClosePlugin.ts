export function postClosePlugin() {
  parent.postMessage({
    pluginMessage: { type: 'close' }
  }, '*');
}