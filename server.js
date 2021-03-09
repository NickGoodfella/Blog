if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
} 

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const userRouter = require('./models/user')
const adminRouter = require('./routes/admin')
const app = express()

const CONNECTION_URI =process.env.DATABASE_URL
mongoose.connect(CONNECTION_URI, {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true
});

app.set('view engine', 'ejs')
app.use('/admin', adminRouter)
app.use(express.urlencoded({extnded: false}))
app.use(methodOverride('_method'))
app.use(express.static("public"))




app.get('/', async (req, res) => {
    try {

    
    if(req.query.search) {
        escapeRegex(req.query.search)
        const regex = new RegExp(escapeRegex(req.query.search), 'gi')
        const articles = await Article.find({title: regex}).sort({createdAt: 'desc' })
        res.render('articles/index', {articles: articles})

    } else {
    
        const articles = await Article.find().sort({createdAt: 'desc' })
 
        res.render('articles/index', {articles: articles})
       
    }
} catch(error) {
    console.log(error)
}
})
app.get('/about', async(req, res) => {
    try {
        res.render('articles/about');
    } catch(error) {
        console.log(error)
    }

})




function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


app.use('/users', userRouter)
app.use('/articles', articleRouter)

let port = process.env.PORT
app.listen(port || 3000)