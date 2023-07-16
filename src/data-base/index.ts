import { connect } from '@planetscale/database'
import { isEmpty } from 'lodash';

const config = {
  host: "aws.connect.psdb.cloud",
  username: process.env.DATA_BASE_USERNAME,
  password: process.env.DATA_BASE_PASSPORT,
}
let con: ReturnType<typeof connect> | null = null

export const getDatabaseClient = () => {
  if (con) return con;
  con = connect(config)
  return con
}

export const execSQL = async (sql: string) => {
  const con = getDatabaseClient()
  const result = await con.execute(sql)
  return result.rows
}

export const insertData = async (data: any[]) => {
  if (isEmpty(data)) return
  const res = data.reduce((acc, cur) => {
    const { title, link } = cur

    const curItem = `('${title.replace(/["']/g, '')}', '${link}', ' ', ' ', ' ', ' ')`
    return [...acc, curItem]
  }, [] as any[])
  const insertSql = `insert into rss (title, link, pubDate, content, summary, isoDate) values` + res.join(',') + ';'
  await execSQL(insertSql)
}

export const getRssData = async () => {
  const sql = `select id, title, link, pubDate, content, summary, isoDate from rss`
  const res = await execSQL(sql)
  return res as any[]

}