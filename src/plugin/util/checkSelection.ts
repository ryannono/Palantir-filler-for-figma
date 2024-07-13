// Function to check if the current selection is a text node
export function checkSelection() {
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
