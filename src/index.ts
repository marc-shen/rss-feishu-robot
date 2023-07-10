import {
  fetchRssData,
  getSavedData,
  noticeFeishuRobot,
  uniqFeedMessage,
  writeFeedData,
} from "./feed";
import { feishuFormatData } from "./robots/feishu-robot";
(async () => {
  const { preUrlsSet, originData } = getSavedData();
  const currentFeedData = (await fetchRssData()) || [];
  const [mergedData, feishuPostMessage] = await uniqFeedMessage<FormatDataType[][]>({
    currentFeedData,
    originData,
    preUrlsSet,
    formatDataFn: feishuFormatData
  });

  writeFeedData(JSON.stringify(mergedData));
  noticeFeishuRobot(feishuPostMessage)
})();
