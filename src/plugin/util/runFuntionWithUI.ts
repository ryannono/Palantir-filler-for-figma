import { appendTextToSelection } from "./appendTextToSelection";
import { checkSelection } from "./checkSelection";

export function runPluginWithUI() {
  figma.showUI(__html__, { width: 400, height: 184 });
  checkSelection();
  figma.on('selectionchange', checkSelection);
  figma.ui.onmessage = async (msg) => {
    switch (msg.type) {
      case 'appendText':
        try {
          await appendTextToSelection(msg.text);
        } catch (e) {
          console.error('Error in UI append:', e);
          figma.notify('Failed to append text from UI, make sure you have a text layer selected :)');
        }
        break;
    
      case 'close':
        figma.closePlugin('Plugin exited successfully');
        break;
    }
}
}