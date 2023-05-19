const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// DB Init
require('./model/connect')
const { Url, Category } = require('./model/bookmark')
const {
  findAll,
  addCategory,
  addUrl,
  deleteUrl,
  deleteCategory,
  editCategory
} = require('./utils/category')


const app = express()
const port = 3000


// Setup Middleware
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.use(expressLayouts)
app.set('layout', 'layouts/main.ejs')

// set static folder
app.use(express.static('public'))

app.get('/', async (req, res) => {
  res.render('index', { bookmark: await findAll() })
})

// add category
app.get('/add', (req, res) => {
  res.render('add-category', { errorMessage: '' })
})

app.post('/add', async (req, res) => {
  const resp = await addCategory(req.body.category, req.body.url)

  if (!resp) {
    res.render('add-category', {
      errorMessage: `${req.body.category} telah ada`
    })
  } else {
    res.redirect('/')
  }
})

// add link to the category
app.get('/add/link/:id', async (req, res) => {
  const document = await Category.findById(req.params.id, 'category')
  res.render('add-link', { category: document.category, id: document.id })
})

app.post('/add/link', async (req, res) => {
  await addUrl(req.body.id, req.body.links)
  res.redirect('/')
})

// delete category
app.get('/delete/:id', (req, res) => {
  deleteCategory(req.params.id)
  res.redirect('/')
})

// delete link from the category
app.post('/delete/url', (req, res) => {
  deleteUrl(req.body)
  res.redirect('/')
})

// show all link of category
app.get('/manage/:id', async (req, res) => {
  const document = await Category.findById(req.params.id)
    .populate('urls')

  if (document) {
    res.render('manage', { document })
  } else {
    res.status(404).send('not found')
  }
})

// change category title
app.get('/edit/:id', async (req, res) => {
  const document = await Category.findById(req.params.id)
  if (document) {
    res.render('edit', { document })
  } else {
    res.status(404).send('keyword not found')
  }
})

app.post('/edit', async (req, res) => {
  await editCategory(req.body.id, req.body.newCategory)
  res.redirect('/')
})

app.listen(port, () => {
  console.log('app listening at https://localhost:3000')
})
