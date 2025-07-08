function updateContextMenu() {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    try {
      console.log("Text selected:", selection);
      chrome.runtime.connect({ name: "contextUpdater" }).postMessage({
        action: "updateContextMenu",
        selectionText: selection,
      });
    } catch (error) {
      console.warn("Extension context invalidated. Retrying...");
      setTimeout(updateContextMenu, 1000); // Retry after 1 sec
    }
  }
}

document.addEventListener("mouseup", updateContextMenu);

// Detect SPA (Single Page Application) navigations and refresh context menus
document.addEventListener("selectionchange", updateContextMenu);

let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    console.log("Page changed (SPA detected), reapplying content script.");
    updateContextMenu();
  }
}).observe(document, { subtree: true, childList: true });
