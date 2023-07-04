import axios from 'axios'
import fs from "fs"
import { isEmpty, flatten } from "lodash"
import Parser from 'rss-parser';
const DEFAULT_ROBOT_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/91abe2b4-c5a5-4336-9732-cc4a94504c73'

let preUrls: string[] = []
if (fs.existsSync('./fetchedData.json')) {
  preUrls = JSON.parse(fs.readFileSync('./fetchedData.json', "utf-8") || '[]')
}
const urlsSet = new Set(preUrls)


// https://www.robinwieruch.de/index.xml
const parser = new Parser()
interface FeedDataType {
  name: string;
  url: string
}
interface FeedResType { title: string, link: string }

const instance = axios.create();

instance.interceptors.response.use((response) => {
  if (response.status !== 200 || response.data.StatusCode !== 0) {
    console.log(response);
    throw new Error("send message error")
  }
  return response.data
}, (err) => {
  console.log(err?.message)
})


/**
 * Sends a text message to the DEFAULT_ROBOT_URL.
 *
 * @param {string} message - The message to be sent.
 * @return {Promise<void>} - A Promise that resolves when the message is sent.
 */
async function sendTextMessage(message: string): Promise<void> {
  const res = await instance({
    method: "POST",
    url: DEFAULT_ROBOT_URL,
    data: {
      "msg_type": "text",
      "content": {
        "text": message
      }
    }
  })
}

// sendTextMessage('测试机器人发送消息')


/**
 * Sends a post message.
 *
 * @param {any} message - The message to be sent.
 * @return {Promise<any>} A Promise that resolves with the response.
 */
async function sendPostMessage(message: any): Promise<any> {
  const res = await instance({
    method: "POST",
    url: DEFAULT_ROBOT_URL,
    // data: {
    //   "msg_type": "post",
    //   "content": {
    //     "post": {
    //       "zh_cn": {
    //         "title": "每日 feed 更新",
    //         "content": message.map(item => ({
    //           "tag": "a",
    //           "text": item.title,
    //           "href": item.link
    //         }))
    //       }
    //     }
    //   }
    // }
    data: {
      "msg_type": "post",
      "content": {
        "post": {
          "zh_cn": {
            "title": "每日 feed 更新",
            "content": message
          }
        }
      }
    }
  })
}



/**
 * Fetches RSS data and performs various operations on it.
 *
 * @return {Promise<void>} Returns a promise that resolves when the function completes.
 */
async function fetchRssData(): Promise<void> {

  try {
    const rssData = fs.readFileSync('./data.json', 'utf-8') || '{}'
    const data = JSON.parse(rssData) as FeedDataType[];
    if (isEmpty(data)) return
    const feedData = await Promise.all(data.map(async feedItem => {

      const feed = await parser.parseURL(feedItem.url);
      console.log(feed.items)
      return feed.items.map(({ title, link }) => ({ title, link }))
    }))
    let flattenFeedData = flatten(feedData) as FeedResType[]
    flattenFeedData = flattenFeedData.filter(item => !urlsSet.has(item.link))
    const urls = flattenFeedData.map(item => item.link)
    fs.writeFileSync('./fetchedData.json', JSON.stringify([...preUrls, ...urls]))
    const message = flattenFeedData.map(item => ({
      "tag": "a",
      "text": item.title,
      "href": item.link
    })).map(item => [item])
    sendPostMessage(message)
  }
  catch (err) {
    sendTextMessage(err.message || 'fetch rss data error')

  }

}
fetchRssData()