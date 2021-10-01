const getDataButton = document.getElementById("getData");

getDataButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: getData,
    },
    ([{ result }]) => {
      alert(JSON.stringify(result));
    }
  );
});

function getData() {
  const data = {
    title: document.querySelector(
      "#contentWrapper > div:nth-child(1) > div > div.h1-title > div > h1 > strong"
    ).textContent,
    englishTitle: (
      document.querySelector(
        "#contentWrapper > div:nth-child(1) > div > div.h1-title > div > p"
      ) || {}
    ).textContent,
    score: document.querySelector(
      "#content > table > tbody > tr > td:nth-child(2) > div.js-scrollfix-bottom-rel > table > tbody > tr:nth-child(1) > td > div.pb16 > div.di-t.w100.mt12 > div.anime-detail-header-stats.di-tc.va-t > div.stats-block.po-r.clearfix > div.fl-l.score > div"
    ).textContent,
    imageURL: document
      .querySelector(
        "#content > table > tbody > tr > td.borderClass > div > div:nth-child(1) > a > img"
      )
      .getAttribute("src"),
    malURL: window.location.href,
  };
  data.epCount = document
    .querySelector(
      `#content > table > tbody > tr > td.borderClass > div > div:nth-child(${
        data.englishTitle ? 14 : 13
      })`
    )
    .textContent // '\n  Episodes:\n  12\n  '
    .trim() // 'Episodes:\n  12'
    .split("\n") //['Episodes:', '  12']
    .at(-1) //' 12'
    .trim(); //'12'
  return data;
}
