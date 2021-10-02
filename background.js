function addAnimeCard(info, tab) {
  chrome.tabs.sendMessage(tab.id, "addAnimeCard", { frameId: info.frameId });
}

chrome.contextMenus.removeAll();

chrome.contextMenus.create({
  title: "Paste Mal Data",
  // contexts: ["link"],
  contexts: ["all"],
  documentUrlPatterns: ["https://trello.com/*"],
  id: "PasteMalDataContextMenu",
});
chrome.contextMenus.onClicked.addListener(addAnimeCard);
