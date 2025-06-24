const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session"); 

const categoriesController = require("./categories/CategoriesController");
const articleController = require("./articles/ArticlesController");
const usercontroller = require("./user/Usercontroller");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User");
const { where } = require("sequelize");

// View Engine  
app.set('view engine','ejs');

//Session
app.use(session({
    secret: "kghjkhgbjkfsdg", cookie: {maxAge: 300000} 
}))

// body-paerser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// static
app.use(express.static('public'));

// connection 
connection
    .authenticate()
    .then( () =>{
        console.log("Conexão com o Banco bem sucedida")
    }).catch((error) => {
        console.log(error);

    });

app.use("/",categoriesController);
app.use("/",articleController);
app.use("/",usercontroller);

app.get("/",(req,res)=>{
    Article.findAll({
        order: [
            ['id','DESC']
        ], 
        limit : 4
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render("index", {articles:articles, categories:categories});
        })

        
    })
    
});

app.get("/:slug",(req,res) =>{
    var slug = req.params.slug
    Article.findOne({
        where : {
            slug : slug
        }
    }).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article : article, categories:categories});
            })
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect("/");
    })
})


app.get("/category/:slug",(req,res) => {
    var slug = req.params.slug;

    Category.findOne({
        where:{
            slug : slug
        },
        include:[{model : Article}]
    }).then(category =>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render("index",{articles: category.articles, categories:categories});
            })
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect("/");
    })

})

app.listen(8080,()=>{
    console.log("O Servidor está Rodando");
})