const { Category, Url } = require('../model/bookmark')
const { insertURL } = require('./url')

const findAll = async () => {
  const categories = await Category.find().populate('urls')
  return categories
}

const addCategory = async (category, urls) => {
  const isCategoryExist = await Category.findOne({ category: { $regex: `^${category}$`, $options: 'i' } })

  if (isCategoryExist) return false

  const IDs = await insertURL(urls)
  await Category.create({ category, urls: IDs })
  return true
}

const addUrl = async (id, urls) => {
  if (typeof urls === 'string') urls = [urls]
  const document = await Category.findById(id)

  for (const url of urls) {
    let newUrlId
    const urlExist = await Url.exists({ url })
    if (urlExist) {
      if (!document.urls.includes(urlExist._id)) {
        newUrlId = urlExist._id
      }
    } else {
      newUrlId = await insertURL(url)
    }
    await Category.findByIdAndUpdate(id, { $push: { urls: newUrlId } })
  }
}
}

const deleteUrl = async ({ categoryId, urlId }) => {
  await Category.findByIdAndUpdate(categoryId, {
    $pull: { urls: urlId }
  })
}

const deleteCategory = async (id) => {
  await Category.findByIdAndDelete(id)
}

const editCategory = async (id, newCategory) => {
  await Category.findByIdAndUpdate(id, { category: newCategory })
}

module.exports = {
  findAll,
  addCategory,
  addUrl,
  deleteUrl,
  deleteCategory,
  editCategory
}
