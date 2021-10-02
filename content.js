let clickedEl = null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function querySelectorPolling(selector, callback) {
  while (true) {
    const element = document.querySelector(selector);
    if (element != null) {
      callback(element);
      return;
    }
    await sleep(500);
  }
}

async function addAttachment(url) {
  await querySelectorPolling(
    "#chrome-container > div.window-overlay > div > div.window-wrapper.js-tab-parent > div > div.window-sidebar > div:nth-child(2) > div > a.button-link.js-attach",
    (element) => element.click()
  ); // click attachment button
  await querySelectorPolling("#addLink", (element) => (element.value = url)); // fill attachment url
  await querySelectorPolling(
    "#chrome-container > div.pop-over.is-shown > div > div:nth-child(2) > div > div > div > input.js-add-attachment-url",
    (element) => element.click()
  ); // click attach button
}

async function addAnimeCard(title, imageURL, malURL) {
  const textBox = clickedEl;
  textBox.value = title;
  document
    .querySelector(
      "#board > div:nth-child(1) > div > div.list-cards.u-fancy-scrollbar.u-clearfix.js-list-cards.js-sortable.ui-sortable > div > div.cc-controls.u-clearfix > div:nth-child(1) > input"
    )
    .click(); // click add card

  const cardsList = clickedEl.parentNode.parentNode.parentNode.parentNode;

  await sleep(1000);

  const newCard = cardsList.children[cardsList.childElementCount - 2];
  newCard.click();

  await addAttachment(imageURL);
  await addAttachment(malURL);

  await querySelectorPolling(
    "#chrome-container > div.window-overlay > div > div.window-wrapper.js-tab-parent > div > div.window-cover.js-card-cover-box.js-stickers-area.js-open-card-cover-in-viewer.is-covered.has-attachment-cover > div.window-cover-menu > a",
    (element) => element.click()
  ); //click cover button
  await querySelectorPolling(
    "#chrome-container > div.pop-over.is-shown > div > div:nth-child(2) > div > div > div > div:nth-child(1) > div > div.isvr-Reb94vq0g._3bvxiZCqVvPKiY.ArpE6wxF5lsZ5R",
    (element) => element.click()
  ); // click second option in cover (text over image)
  await querySelectorPolling(
    "#chrome-container > div.pop-over.is-shown > div > div.pop-over-header.js-pop-over-header > a",
    (element) => element.click()
  ); // click cover popup exit icon
  await querySelectorPolling(
    "#chrome-container > div.window-overlay > div > div.window-wrapper.js-tab-parent > a",
    (element) => element.click()
  ); // click card exit icon
}

document.addEventListener(
  "contextmenu",
  function (event) {
    clickedEl = event.target;
  },
  true
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request === "addAnimeCard") {
    chrome.storage.local.get("animeData", ({ animeData }) => {
      if (!animeData) {
        alert("Please copy a MAL page first");
        return;
      }
      addAnimeCard(
        `${animeData.title}[${animeData.score}][${animeData.epCount}ep]${
          animeData.englishTitle ? "(" + animeData.englishTitle + ")" : ""
        }`,
        animeData.imageURL,
        animeData.malURL
      );
      chrome.storage.local.remove("animeData");
    });
  }
});
