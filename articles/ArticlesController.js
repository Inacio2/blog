const express = require("express");
const router = express.Router();
const Category = require("../categories/Category.js");
const Article = require("./Article.js");
const slugfy = require("slugify");

router.get("/admin/articles",(req,res) =>{
    Article.findAll({
        include : [{model : Category}]
    }).then(articles => {
        res.render("admin/articles/index", { articles : articles});
    });
    
   
});


router.get("/admin/articles/new",(req,res) =>{
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories : categories});
    })
    
});


router.post("/articles/save",(req,res)=>{
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title : title,
        slug : slugfy(title),
        body : body,
        categoryId : category
    }).then(()=>{
        res.redirect("/admin/articles");
    })

})

router.post("/admin/articles/detele",(req,res)=>{
    var id = req.body.id;
    if(id != undefined){ // se o valor for diferente de nulo

        if(!isNaN(id)){ // se for um número

            Article.destroy({
                where: {
                    id : id
                } 
            }).then(()=>{ // Se não um número
                res.redirect("/admin/articles");
            })

        }else{
            res.redirect("/admin/articles/");
        }
    }else{
        res.redirect("/admin/articles/");
    }
})

router.get("/admin/articles/edit/:id",(req,res) => {
    var id = req.params.id;
    
    Article.findByPk(id).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit",{article : article, categories : categories});
            })
        }else{
            res.redirect("/admin/articles/");
        }
    }).catch(erro => {
        res.redirect("/admin/articles");
    })

})

router.post("/article/edit",(req,res) => {
    var id = req.body.id;
    var title = req.body.title;

    Article.update({title : title, slug : slugfy(title)}, {
        where:{
            id : id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    })
})

router.post("/admin/article/update",(req,res) =>{
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.update({
        id : id,
        title : title,
        body : body,
        categoryId: category,
        slug : slugfy(title)
        },{
            where : {
                id : id
            }
        }).then(()=>{ // Se não um número
                res.redirect("/admin/articles");
            }).catch(err => {
                res.redirect("/");
            })
});

router.get("/article/page/:num",(req,res) => {

    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) * 4) - 4;
    }
 
    Article.findAndCountAll({
        limit : 4,
        offset : offset
    }).then( articles =>{
        var next = false;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            next : next,
            articles : articles
        }
        Category.findAll().then(categories => {
            res.render("admin/articles/page", {categories : categories, result : result})
        })
    })
});

module.exports = router