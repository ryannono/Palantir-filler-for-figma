figma.showUI(__html__, { width: 400, height: 184 });

// Function to check if the current selection is a text node
function checkSelection() {
  const selectedNode = figma.currentPage.selection[0];

  if (selectedNode && selectedNode.type === 'TEXT') {
    figma.ui.postMessage({ type: 'selectionChange', isTextNode: true });
  } else {
    figma.ui.postMessage({ type: 'selectionChange', isTextNode: false });
  }
}

// Listen for selection changes
figma.on('selectionchange', checkSelection);

// initial check
checkSelection();

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'appendText') {
    const selectedNode = figma.currentPage.selection[0];

    if (selectedNode.type === 'TEXT') {
        // Load all fonts used in the selected text node
        await figma.loadFontAsync(selectedNode.fontName as FontName);

        // Append text to the existing text node
        selectedNode.characters += msg.text;
    }
  }
};