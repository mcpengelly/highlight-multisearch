const DEBUG_MODE = false; // for logs only

function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log("[DEBUG]", ...args);
  }
}

function debugError(...args) {
  console.error("[ERROR]", ...args);
}

function createContextMenu(id, title) {
  try {
    chrome.contextMenus.create({
      id,
      title,
      contexts: ["selection"]
    }, () => {
      if (chrome.runtime.lastError) {
        debugError(`Failed to create menu ${id}:`, chrome.runtime.lastError);
      }
    });
  } catch (error) {
    debugError(`Failed to create context menu ${id}:`, error);
  }
}

function updateContextMenuTitle(id, title) {
  try {
    chrome.contextMenus.update(id, { title }, () => {
      if (chrome.runtime.lastError) {
        debugError(`Failed to update menu ${id}:`, chrome.runtime.lastError);
      }
    });
  } catch (error) {
    debugError(`Failed to update context menu ${id}:`, error);
  }
}

function createTab(url) {
  try {
    chrome.tabs.create({ url }, (tab) => {
      if (chrome.runtime.lastError) {
        debugError('Failed to create tab:', chrome.runtime.lastError);
      }
    });
  } catch (error) {
    debugError('Failed to create new tab:', error);
  }
}

const MENU_CONFIG = [
  { key: 'GoogleMaps', id: 'searchGoogleMaps', title: '🔍 Search Google Maps' },
  { key: 'AllTrails', id: 'searchAllTrails', title: '🏔️ Search AllTrails' },
  { key: 'Amazon', id: 'searchAmazon', title: '🛒 Search Amazon' },
  { key: 'IMDB', id: 'searchIMDB', title: '🎬 Search IMDb' },
  { key: 'Wikipedia', id: 'searchWikipedia', title: '📖 Search Wikipedia' },
  { key: 'YouTube', id: 'searchYouTube', title: '▶️ Search YouTube' }
];

function createMenusFromToggles(toggles) {
  chrome.contextMenus.removeAll(() => {
    MENU_CONFIG.forEach(menu => {
      if (toggles[menu.key]) {
        createContextMenu(menu.id, menu.title);
      }
    });
  });
}

function loadAndCreateMenus() {
  chrome.storage.sync.get(["engineToggles"], (data) => {
    const toggles = data.engineToggles || {
      GoogleMaps: true,
      AllTrails: true,
      Amazon: true,
      IMDB: true,
      Wikipedia: true,
      YouTube: true
    };
    createMenusFromToggles(toggles);
  });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed. Creating context menus...");
  loadAndCreateMenus();
});

// Handle context menu updates when text is selected
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "contextUpdater") {
    port.onMessage.addListener((message) => {
      if (message.action === "updateContextMenu" && message.selectionText) {
        console.log("Updating context menu for selection:", message.selectionText);

        const truncatedText = message.selectionText.length > 30
          ? message.selectionText.substring(0, 27) + "..."
          : message.selectionText;

        const menuUpdates = [
          { id: "searchGoogleMaps", emoji: "🔍" },
          { id: "searchAllTrails", emoji: "🏔️" },
          { id: "searchIMDB", emoji: "🎬" },
          { id: "searchWikipedia", emoji: "📖" }, 
          { id: "searchYouTube", emoji: "▶️" },
          { id: "searchAmazon", emoji: "🛒" },
        ];

        menuUpdates.forEach(menu => {
          updateContextMenuTitle(
            menu.id,
            `${menu.emoji} Search ${menu.id.replace('search', '')} for '${truncatedText}'`
          );
        });
      }
    });
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("Context menu clicked:", info.menuItemId, "Text:", info.selectionText);

  if (!info.selectionText) {
    console.warn("No text selected!");
    return;
  }

  const query = encodeURIComponent(info.selectionText);
  const urlMap = {
    "searchGoogleMaps": `https://www.google.com/maps/search/?q=${query}`,
    "searchAllTrails": `https://www.google.com/search?q=site:alltrails.com ${query}`,
    "searchIMDB": `https://www.imdb.com/find?q=${query}`,
    "searchWikipedia": `https://en.wikipedia.org/wiki/Special:Search?search=${query}`,
    "searchYouTube": `https://www.youtube.com/results?search_query=${query}`
  };

  const url = urlMap[info.menuItemId];
  if (url) {
    createTab(url);
  }
  
  if (info.menuItemId === "searchAmazon") {
    chrome.storage.sync.get(["amazonDomain"], (data) => {
      const amazonDomain = data.amazonDomain || "com"; // Default to US
      const amazonUrl = `https://www.amazon.${amazonDomain}/s?k=${query}`;
      createTab(amazonUrl);
    });
  }
  
});

// update amazon domain dynamically to prevent requiring reload after config change
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateAmazonDomain") {
    console.log(`Amazon domain updated to: ${message.domain}`);
  }
  if (message.action === "updateEngineToggles") {
    createMenusFromToggles(message.toggles);
  }
});
