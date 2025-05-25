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

module.exports = router