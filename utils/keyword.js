const fs = require('fs')
const { JSDOM } = require('jsdom')

// initialitation
const dataPath = "./data/bookmark.json"

// save bookmark
const save = (bookmark) => {
  fs.writeFileSync(dataPath, JSON.stringify(bookmark), 'utf8')
}

// get all categories
const getBookmark = () => {
  const buffer = fs.readFileSync(dataPath, "utf8")
  const bookmark = JSON.parse(buffer)
  return bookmark
}

// get one category
const getCategory = (title) => {
  const bookmark = getBookmark()
  const selectedCategory = bookmark.find((category) => category.title === title)
  return selectedCategory
}

// get title from the url and generate array of object links
const generateLinks = async (links) => {
  const newLinks = [] // -> [ {title: "", link: ""}]

  if (typeof links === 'string') {
    const html = await fetch(links)
    const dom = new JSDOM(await html.text())
    const title = await dom.window.document.querySelector('title')
    newLinks.push({ title: title.textContent, link: links })
  } else {
    for (const link of links) {
      const html = await fetch(link)
      const dom = new JSDOM(await html.text())
      const title = await dom.window.document.querySelector('title')
      newLinks.push({ title: title.textContent, link: link })
    }
  }

  return newLinks
}

const filterDuplicateLinks = links => {
  const uniqueLink = []
  const filteredLinks = links.filter(link => {
    const isDuplicate = uniqueLink.includes(link.link)

    if (!isDuplicate) {
      uniqueLink.push(link.link)
      return true
    }
    return false
  })

  return filteredLinks
}

// add category to the bookmark
const addCategory = async (category) => {
  const bookmark = getBookmark()
  const available = bookmark.find((ctg) => ctg.title.toLowerCase() === category.title.toLowerCase())
  if (available) {
    return false
  }

  const links = await generateLinks(category.links)
  category.links = filterDuplicateLinks(links)

  bookmark.push(category)
  save(bookmark)
}

// add link to the category
const addLink = async (category, links) => {
  const bookmark = getBookmark()
  const selectedCategory = bookmark.find(ctg => ctg.title.toLowerCase() === category.toLowerCase())
  links = await generateLinks(links)
  links = selectedCategory.links.concat(links)
  selectedCategory.links = filterDuplicateLinks(links)

  save(bookmark)
}

// delete category in bookmark
const deleteCategory = (category) => {
  const bookmark = getBookmark()
  const filteredBookmark = bookmark.filter(ctg => ctg.title !== category)
  save(filteredBookmark)
}

// delete link in category
const deleteLink = (category, link) => {
  const bookmark = getBookmark()
  const selectedCategory = getCategory(category)
  const categoryIndex = bookmark.indexOf(selectedCategory)
  selectedCategory.links = selectedCategory.links.filter(lk => lk.link !== link)
  bookmark.splice(categoryIndex, 1, selectedCategory)
  save(bookmark)
}

// edit category title
const editCategory = (category, newCategoryTitle) => {
  if (category.toLowerCase() === newCategoryTitle.toLowerCase()) {
    return false
  }

  const bookmark = getBookmark()
  const selectedCategory = getCategory(category)
  const categoryIndex = bookmark.indexOf(selectedCategory)
  selectedCategory.title = newCategoryTitle
  bookmark.splice(categoryIndex, 1, selectedCategory)
  save(bookmark)
}

module.exports = {
  getBookmark,
  getCategory,
  addCategory,
  addLink,
  deleteCategory,
  deleteLink,
  editCategory
}
