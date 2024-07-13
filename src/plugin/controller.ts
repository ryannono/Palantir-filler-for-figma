import { LoremIpsumGenerator } from '../app/util/loremIpsumGenerator';

export const FILLER_OPTIONS = ["WORD", "SENTENCE", "PARAGRAPH"] as const;

export type TFillerOption = typeof FILLER_OPTIONS[number];

// Shared function for appending text
async function appendTextToSelection(text: string): Promise<void> {
  const selectedNode = figma.currentPage.selection[0];
  if (selectedNode && selectedNode.type === 'TEXT') {
    try {
      await figma.loadFontAsync(selectedNode.fontName as FontName);
      selectedNode.characters += text;
    } catch (error) {
      console.error('Error appending text:', error);
      figma.notify('Error appending text');
      throw error; // Re-throw the error so the caller can handle it if needed
    }
  } else {
    throw new Error('Please select a text node');
  }
}

// Function to check if the current selection is a text node
function checkSelection() {
  try {
    const selectedNode = figma.currentPage.selection[0];
    if (selectedNode && selectedNode.type === 'TEXT') {
      figma.ui.postMessage({ type: 'selectionChange', isTextNode: true });
    } else {
      figma.ui.postMessage({ type: 'selectionChange', isTextNode: false });
    }
  } catch (error) {
    console.error('Error checking selection:', error);
  }
}

// Handle plugin commands
figma.on('run', async ({ command, parameters }) => {
  const amount = Math.max(1, parseInt(parameters?.amount as string, 10) || 1);

  let fillerType: TFillerOption;
  switch (command) {
    case 'inlineInsertWord':
      fillerType = FILLER_OPTIONS[0];
      break;
    case 'inlineInsertSentence':
      fillerType = FILLER_OPTIONS[1];
      break;
    case 'inlineInsertParagraph':
      fillerType = FILLER_OPTIONS[2];
      break;
    case 'launch':
      figma.showUI(__html__, { width: 400, height: 184 });
      checkSelection();
      figma.on('selectionchange', checkSelection);
      figma.ui.onmessage = async (msg) => {
        if (msg.type === 'appendText') {
          try {
            await appendTextToSelection(msg.text);
          } catch (error) {
            console.error('Error in UI append:', error);
            figma.notify('Failed to append text from UI');
          }
        }
      };
      return;
    default:
      figma.closePlugin('Unknown command');
      return;
  }

  let fillerText: string;
  try {
    fillerText = new LoremIpsumGenerator().generate(amount, fillerType);
  } catch (error) {
    console.error('Error generating filler text:', error);
    figma.closePlugin('Error generating filler text');
    return;
  }
  
  try {
    await appendTextToSelection(fillerText);
    figma.closePlugin();
  } catch (error) {
    console.error('Error in quick insert:', error);
    figma.closePlugin('Failed to append text');
  }
});