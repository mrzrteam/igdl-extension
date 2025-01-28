chrome.action.onClicked.addListener(async (tab) => {
  try {
    const tabUrl = tab.url;
    if (!tabUrl.includes("instagram.com/reels")) {
      await chrome.action.setBadgeText({
        text: "❌",
        tabId: tab.id
      });
      setTimeout(() => {
        chrome.action.setBadgeText({
          text: "",
          tabId: tab.id
        });
      }, 2000);
      return;
    }

    await chrome.action.setBadgeText({
      text: "⏳",
      tabId: tab.id
    });

    const apiBase = "https://aihub.xtermai.xyz/api/downloader/instagram";
    const apiKey = "Bell409";
    const apiUrl = `${apiBase}?url=${encodeURIComponent(tabUrl)}&key=${apiKey}`;

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error fetching API: ${response.statusText}`);
    
    const data = await response.json();
    if (!data.status) throw new Error("API response indicates failure");

    const videoContent = data.data.content.find(item => item.type === "video");
    if (!videoContent || !videoContent.url) {
      throw new Error("Video URL not found in API response");
    }

    const filename = `instagram_reel_${Date.now()}.mp4`;
    await chrome.downloads.download({
      url: videoContent.url,
      filename: `instagram_reel_${Date.now()}.mp4`,
      saveAs: false
    });

    await chrome.action.setBadgeText({
      text: "✓",
      tabId: tab.id
    });

    setTimeout(() => {
      chrome.action.setBadgeText({
        text: "",
        tabId: tab.id
      });
    }, 2000);

  } catch (error) {
    await chrome.action.setBadgeText({
      text: "❌",
      tabId: tab.id
    });

    setTimeout(() => {
      chrome.action.setBadgeText({
        text: "",
        tabId: tab.id
      });
    }, 2000);
  }
});
