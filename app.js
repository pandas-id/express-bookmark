const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { getBookmark, getCategory, addCategory, addLink, deleteCategory, deleteLink, editCategory } = require('./utils/keyword')

const app = express()
const port = 3000


// Setup Middleware
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.use(expressLayouts)
app.set('layout', 'layouts/main.ejs')

// set static folder
app.use(express.static('public'))

app.get('/', (req, res) => {
  const bookmark = getBookmark()
  res.render('index', { bookmark })
})

// add category
app.get('/add', (req, res) => {
  res.render('add')
})

app.post('/add', (req, res) => {
  addCategory(req.body)
  res.redirect('/')
})

// add link to the category
app.get('/add/link/:category', (req, res) => {
  const category = getCategory(req.params.category)
  if (category) {
    res.render('add-link', {
      category: req.params.category
    })
  } else {
    res.status(404).send('not found')
  }
})

app.post('/add/link', (req, res) => {
  addLink(req.body.category, req.body.links)
  res.redirect('/')
})

// delete category
app.get('/delete/:category', (req, res) => {
  deleteCategory(req.params.category)
  res.redirect('/')
})

// delete link from the category
app.post('/delete/link', (req, res) => {
  deleteLink(req.body.category, req.body.link)
  res.redirect('/')
})

// show all link of category
app.get('/manage/:category', (req, res) => {
  const category = getCategory(req.params.category)
  if (category) {
    res.render('manage', { category })
  } else {
    res.status(404).send('not found')
  }
})

// change category title
app.get('/edit/:category', (req, res) => {
  const category = getCategory(req.params.category)
  if (category) {
    res.render('edit', { category })
  } else {
    res.status(404).send('keyword not found')
  }
})

app.post('/edit', (req, res) => {
  editCategory(req.body.category, req.body.newCategory)
  res.redirect('/')
})

app.listen(port, () => {
  console.log('app listening at https://localhost:3000')
})
