import { truncate, formatMenuTitle, getSearchUrl } from "../utils/utils.js";

const DEBUG_MODE = false; // for logs only

/**
 * Log errors to the console.
 * @param {...any} args
 */
function debugError(...args) {
  console.error("[ERROR]", ...args);
}

/**
 * Create a context menu item.
 * @param {string} id
 * @param {string} title
 */
function createContextMenu(id, title) {
  try {
    chrome.contextMenus.create(
      {
        id,
        title,
        contexts: ["selection"],
      },
      () => {
        if (chrome.runtime.lastError) {
          debugError(`Failed to create menu ${id}:`, chrome.runtime.lastError);
        }
      },
    );
  } catch (error) {
    debugError(`Failed to create context menu ${id}:`, error);
  }
}

/**
 * Update a context menu item's title.
 * @param {string} id
 * @param {string} title
 */
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

/**
 * Open a new tab with the given URL.
 * @param {string} url
 */
function createTab(url) {
  try {
    chrome.tabs.create({ url }, (tab) => {
      if (chrome.runtime.lastError) {
        debugError("Failed to create tab:", chrome.runtime.lastError);
      }
    });
  } catch (error) {
    debugError("Failed to create new tab:", error);
  }
}

const MENU_CONFIG = [
  {
    key: "GoogleMaps",
    id: "searchGoogleMaps",
    title: "🔍 Search Google Maps",
    emoji: "🔍",
    engine: "GoogleMaps",
  },
  {
    key: "AllTrails",
    id: "searchAllTrails",
    title: "🏔️ Search AllTrails",
    emoji: "🏔️",
    engine: "AllTrails",
  },
  {
    key: "Amazon",
    id: "searchAmazon",
    title: "🛒 Search Amazon",
    emoji: "🛒",
    engine: "Amazon",
  },
  {
    key: "IMDB",
    id: "searchIMDB",
    title: "🎬 Search IMDb",
    emoji: "🎬",
    engine: "IMDB",
  },
  {
    key: "Wikipedia",
    id: "searchWikipedia",
    title: "📖 Search Wikipedia",
    emoji: "📖",
    engine: "Wikipedia",
  },
  {
    key: "YouTube",
    id: "searchYouTube",
    title: "▶️ Search YouTube",
    emoji: "▶️",
    engine: "YouTube",
  },
];

/**
 * Create context menus based on toggles.
 * @param {object} toggles
 */
function createMenusFromToggles(toggles) {
  chrome.contextMenus.removeAll(() => {
    MENU_CONFIG.forEach((menu) => {
      if (toggles[menu.key]) {
        createContextMenu(menu.id, menu.title);
      }
    });
  });
}

/**
 * Load toggles and create menus.
 */
function loadAndCreateMenus() {
  chrome.storage.sync.get(["engineToggles"], (data) => {
    const toggles = data.engineToggles || {
      GoogleMaps: true,
      AllTrails: true,
      Amazon: true,
      IMDB: true,
      Wikipedia: true,
      YouTube: true,
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
        console.log(
          "Updating context menu for selection:",
          message.selectionText,
        );
        try {
          const truncatedText = truncate(message.selectionText, 30);
          MENU_CONFIG.forEach((menu) => {
            updateContextMenuTitle(
              menu.id,
              formatMenuTitle(menu.engine, menu.emoji, truncatedText),
            );
          });
        } catch (error) {
          debugError("Error updating context menu:", error);
        }
      }
    });
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log(
    "Context menu clicked:",
    info.menuItemId,
    "Text:",
    info.selectionText,
  );
  if (!info.selectionText) {
    console.warn("No text selected!");
    return;
  }
  try {
    if (info.menuItemId === "searchAmazon") {
      chrome.storage.sync.get(["amazonDomain"], (data) => {
        const amazonDomain = data.amazonDomain || "com";
        const url = getSearchUrl("searchAmazon", info.selectionText, {
          amazonDomain,
        });
        createTab(url);
      });
    } else {
      const url = getSearchUrl(info.menuItemId, info.selectionText);
      if (url) {
        createTab(url);
      }
    }
  } catch (error) {
    debugError("Error handling context menu click:", error);
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
