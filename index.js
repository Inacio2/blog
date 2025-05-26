const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articleController = require("./articles/ArticlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const { where } = require("sequelize");

// View Engine
app.set('view engine','ejs');

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

app.get("/",(req,res)=>{
    Article.findAll({
        order: [
            ['id','DESC']
        ]
    }).then(articles => {
        res.render("index", {articles:articles});
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
            res.render("article", {article : article});
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