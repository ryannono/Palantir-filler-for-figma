// Shared function for appending text
export async function appendTextToSelection(text: string): Promise<void> {
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
