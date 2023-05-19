const { Url } = require('../model/bookmark')
const { JSDOM } = require('jsdom')
require('../model/connect')

const insertURL = async (urls) => {
  // convert to object if urls is string
  if (typeof urls === 'string') urls = [urls]

  // filter duplicate urls
  urls = [...new Set(urls)]

  let IDs = []
  for (const url of urls) {
    // if url is already exists
    const exist = await Url.exists({ url })
    if (exist) {
      const existingUrl = await Url.findOne({ url })
      IDs.push(existingUrl._id)
      continue
    }

    const dom = await JSDOM.fromURL(url)
    const title = await dom.window.document.querySelector('title').textContent
    const doc = await Url.create({ title, url})
    IDs.push(doc._id)
  }

  IDs = IDs.length === 1 ? IDs[0] : IDs
  return IDs
}

module.exports = { insertURL }
