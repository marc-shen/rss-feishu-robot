import axios from "axios";
import { FEISHU_ROBOT_CALLBACK_URL } from "../constance";

const instance = axios.create({ baseURL: FEISHU_ROBOT_CALLBACK_URL });

instance.interceptors.response.use(
  (response) => {
    if (response.status !== 200 || response.data.StatusCode !== 0) {
      console.log(response);
      throw new Error("send message error");
    }
    return response.data;
  },
  (err) => {
    console.log(err?.message);
  },
);

export async function sendTextMessage(message: string): Promise<void> {
  await instance({
    method: "POST",
    data: {
      msg_type: "text",
      content: {
        text: message,
      },
    },
  });
}

export async function sendPostMessage(message: any): Promise<any> {
  await instance({
    method: "POST",
    data: {
      msg_type: "post",
      content: {
        post: {
          zh_cn: {
            title: "每日 feed 更新",
            content: message,
          },
        },
      },
    },
  });
}


export const feishuFormatData = (data: FeedResType[]) => {
  return data
    .map((item, index) => ({
      tag: "a",
      text: `${index + 1} : ${item.title}`,
      href: item.link,
    }))
    .map((item) => [item]);
}