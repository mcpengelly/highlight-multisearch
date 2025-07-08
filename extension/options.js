document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("amazonRegion");
  const saveButton = document.getElementById("save");

  const engineIds = [
    { key: 'GoogleMaps', id: 'toggleGoogleMaps' },
    { key: 'AllTrails', id: 'toggleAllTrails' },
    { key: 'Amazon', id: 'toggleAmazon' },
    { key: 'IMDB', id: 'toggleIMDB' },
    { key: 'Wikipedia', id: 'toggleWikipedia' },
    { key: 'YouTube', id: 'toggleYouTube' }
  ];

  // Load engine toggles
  chrome.storage.sync.get(["engineToggles", "amazonDomain"], (data) => {
    const toggles = data.engineToggles || {
      GoogleMaps: true,
      AllTrails: true,
      Amazon: true,
      IMDB: true,
      Wikipedia: true,
      YouTube: true
    };
    engineIds.forEach(({ key, id }) => {
      document.getElementById(id).checked = toggles[key];
    });
    if (data.amazonDomain) {
      select.value = data.amazonDomain;
    }
  });

  // Save selection
  saveButton.addEventListener("click", () => {
    const selectedDomain = select.value;
    const toggles = {};
    engineIds.forEach(({ key, id }) => {
      toggles[key] = document.getElementById(id).checked;
    });
    chrome.storage.sync.set({ amazonDomain: selectedDomain, engineToggles: toggles }, () => {
      alert("Settings saved!");
    });
    chrome.runtime.sendMessage({ action: "updateAmazonDomain", domain: selectedDomain });
    chrome.runtime.sendMessage({ action: "updateEngineToggles", toggles });
  });
});
