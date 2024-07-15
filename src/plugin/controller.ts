import { appendTextToSelection } from './util/appendTextToSelection';
import { TFillerOption, FILLER_OPTIONS } from './util/fillerOptions';
import { LoremIpsumGenerator } from './util/loremIpsumGenerator';
import { runPluginWithUI } from './util/runFuntionWithUI';

// Handle plugin commands
figma.on('run', async ({ command, parameters }) => {
  if (command === "launch") return runPluginWithUI();

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
    default:
      figma.closePlugin('Unknown command');
      return;
  }
  
  try {
    const amount = Math.max(1, parseInt(parameters?.amount as string, 10) || 1);
    await appendTextToSelection(new LoremIpsumGenerator().generate(amount, fillerType));
    figma.notify(`Successfully inserted ${amount} ${fillerType.toLowerCase()}${amount > 1 ? "s" : ""}`);
    figma.closePlugin();
  } catch (error) {
    console.error('Error in quick insert:', error);
    figma.closePlugin('Failed to append text, make sure you have a text layer selected :)');
  }
});