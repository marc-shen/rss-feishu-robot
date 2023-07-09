import {
  fetchRssData,
  getSavedData,
  noticeFeishuRobot,
  uniqFeedMessage,
  writeFeedData,
} from "./feed";

(async () => {
  const { preUrlsSet, originData } = getSavedData();
  const currentFeedData = (await fetchRssData()) || [];
  const [mergedData, _feishuPostMessage] = await uniqFeedMessage({
    currentFeedData,
    originData,
    preUrlsSet,
  });

  writeFeedData(JSON.stringify(mergedData));
  // noticeFeishuRobot(feishuPostMessage)
})();
