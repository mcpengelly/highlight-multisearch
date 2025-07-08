// Truncate a string to a max length, adding '...' if needed
export function truncate(str, maxLength) {
  if (typeof str !== "string") return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Format a context menu title for a search engine.
 * @param {string} engine - The engine name (e.g. 'GoogleMaps').
 * @param {string} emoji - The emoji for the engine.
 * @param {string} text - The text to search for (should be truncated already).
 * @returns {string}
 */
export function formatMenuTitle(engine, emoji, text) {
  return `${emoji} Search ${engine} for '${text}'`;
}

/**
 * Get the search URL for a given engine and query.
 * @param {string} engine - The engine key (e.g. 'searchGoogleMaps').
 * @param {string} query - The search query (unencoded).
 * @param {object} [options] - Optional extra options (e.g. amazonDomain).
 * @returns {string}
 */
export function getSearchUrl(engine, query, options = {}) {
  const encoded = encodeURIComponent(query);
  switch (engine) {
    case "searchGoogleMaps":
      return `https://www.google.com/maps/search/?q=${encoded}`;
    case "searchAllTrails":
      return `https://www.google.com/search?q=site:alltrails.com ${encoded}`;
    case "searchIMDB":
      return `https://www.imdb.com/find?q=${encoded}`;
    case "searchWikipedia":
      return `https://en.wikipedia.org/wiki/Special:Search?search=${encoded}`;
    case "searchYouTube":
      return `https://www.youtube.com/results?search_query=${encoded}`;
    case "searchAmazon": {
      const domain = options.amazonDomain || "com";
      return `https://www.amazon.${domain}/s?k=${encoded}`;
    }
    default:
      return "";
  }
}
