export function postLoremIpsum(loremIpsum: string) {
  parent.postMessage({
    pluginMessage: {
      type: 'appendText',
      text: loremIpsum,
    }
  }, '*');
}