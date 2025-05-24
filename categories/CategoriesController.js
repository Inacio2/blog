const express = require("express");
const router = express.Router(); 
const Category = require("./Category");
const slugify = require("slugify");
const { where } = require("sequelize");


router.get("/admin/categories",(req,res)=>{
    Category.findAll().then(categories => {
        res.render("admin/categories/index",{categories : categories});
    })
    
})

router.get("/admin/categories/new", (req,res)=>{
    res.render("admin/categories/new");

});

router.post("/categories/save",(req,res)=>{
    var title = req.body.title;
    if(title != undefined){

        Category.create({
            title : title,
            slug : slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories");
        })

    }else{
        res.redirect("/admin/categories/new");
    }

})


router.post("/admin/categories/detele",(req,res)=>{
    var id = req.body.id;
    if(id != undefined){ // se o valor for diferente de nulo

        if(!isNaN(id)){ // se for um número

            Category.destroy({
                where: {
                    id : id
                } 
            }).then(()=>{ // Se não um número
                res.redirect("/admin/categories");
            })

        }else{
            res.redirect("/admin/categories/");
        }
    }else{
        res.redirect("/admin/categories/");
    }
})

router.get("/admin/categories/edit/:id",(req,res)=>{
    var id = req.params.id;

    if(isNaN(id)){
        return  res.redirect("/admin/categories/");
    }
    Category.findByPk(id).then(category =>{
        if(category != undefined){
            res.render("admin/categories/edit",{category : category});

        }else{
            res.redirect("/admin/categories/");
        }
    }).catch(erro => {
        res.redirect("/admin/categories/");
    })

})

router.post("/categories/edit",(req,res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title : title, slug : slugify(title)}, {
        where:{
            id : id
        }
    }).then(() => {
        res.redirect("/admin/categories/");
    })
})

module.exports = router;