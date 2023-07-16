import { insertData } from "./data-base";
import {
  fetchRssData,
  getSavedData,
  noticeFeishuRobot,
  uniqFeedMessage,
} from "./feed";
import { feishuFormatData } from "./robots/feishu-robot";
import { FormatDataType } from "./types/global";
(async () => {
  const { preUrlsSet, originData } = await getSavedData();
  const currentFeedData = (await fetchRssData()) || [];
  const [mergedData, feishuPostMessage] = await uniqFeedMessage<FormatDataType[][]>({
    currentFeedData,
    originData,
    preUrlsSet,
    formatDataFn: feishuFormatData
  });

  insertData(mergedData);
  noticeFeishuRobot(feishuPostMessage)
})();
console.log(process.env)