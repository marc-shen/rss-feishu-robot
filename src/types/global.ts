export interface FeedDataType {
  name: string;
  url: string;
}

export interface FeedResType {
  title: string;
  link: string;
}

export interface DetailFeedType {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  summary: string;
  id: string;
  isoDate: string;
}

export interface FormatDataType {
  tag: string;
  text: string;
  href: string;
}