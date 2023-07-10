import fs from "fs-extra";
import path from "path";
import { SAVED_DATA_PATH_NAME, ORIGIN_FEED_DATA_PATH_NAME } from "./constance";
import { flatten, isEmpty, uniqBy } from "lodash";
import Parser from "rss-parser";
import { sendPostMessage } from "./robots/feishu-robot";
const parser = new Parser();

/**
 * @description 获取之前保存的数据,为了推送的时候去重
 */
export const getSavedData = () => {
  let preUrlsSet = new Set<string>();
  let originData: DetailFeedType[] = [];
  const preDataPath = path.join(__dirname, `./${SAVED_DATA_PATH_NAME}`);
  if (fs.existsSync(preDataPath)) {
    const data = JSON.parse(
      fs.readFileSync(preDataPath, "utf8") || "[]",
    ) as DetailFeedType[];
    const urls = data.map((item) => item.link);
    preUrlsSet = new Set(urls);
    originData = data;
  }
  return { preUrlsSet, originData };
};

/**
 *
 * @description 获取本次的数据
 */
export const fetchRssData = async () => {
  const rssPath = path.join(__dirname, `./${ORIGIN_FEED_DATA_PATH_NAME}`);

  if (!fs.existsSync(rssPath)) {
    return null;
  }

  const rssData = JSON.parse(
    fs.readFileSync(rssPath, "utf8") || "[]",
  ) as FeedDataType[];
  if (isEmpty(rssData)) {
    return null;
  }

  const feedData = await Promise.all(
    rssData.map(async (feedItem) => {
      const feed = await parser.parseURL(feedItem.url);
      return feed.items;
    }),
  );

  return flatten(feedData) as DetailFeedType[];
};

interface uniqFeedMessageParams<T> {
  currentFeedData: FeedResType[];
  originData: any[];
  preUrlsSet: Set<string>;
  formatDataFn?: (data: FeedResType[]) => T
}

export const uniqFeedMessage = async <T>({
  currentFeedData,
  originData,
  preUrlsSet,
  formatDataFn
}: uniqFeedMessageParams<T>) => {
  const mergedData = uniqBy(
    [...currentFeedData, ...originData],
    (item) => item.link,
  );

  const currentNoticeData = currentFeedData.filter(
    (item) => !preUrlsSet.has(item.link),
  );

  if (formatDataFn) {
    const postMessage = formatDataFn(currentNoticeData)
    return [mergedData, postMessage] as const
  }
  const postMessage = currentNoticeData
    .map((item, index) => ({
      tag: "a",
      text: `${index + 1} : ${item.title}`,
      href: item.link,
    }))
    .map((item) => [item]);

  return [mergedData, postMessage] as const;
};

export const noticeFeishuRobot = async (
  message: {
    tag: string;
    text: string;
    href: string;
  }[][],
) => {
  sendPostMessage(message);
};

export const writeFeedData = (data: string) => {
  fs.writeFileSync(path.join(__dirname, `./${SAVED_DATA_PATH_NAME}`), data);
};
