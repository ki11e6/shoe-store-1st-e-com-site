
const Adminregister = require('../models/admin')
const Category = require('../models/category')
const Products = require('../models/products')
const Register = require('../models/user')
const {upload} = require('../db/multer')
module.exports = {
    getAdminlogin: (req, res) => {
        if (req.session.message) {
            const message = req.session.message
            req.session.message = ""
            return res.render('admin/adminlogin', { message })
        }
        else {
            const message = ""
            return res.render('admin/adminlogin', { message })
        }

    },
    getAdminhome: (req, res) => {
        return res.render('admin/home-dashboard')
    },
    redirectAdminhome: async (req, res) => {
        const admin = await Adminregister.find({ adminname: req.body.adminname })
        if (admin.length != 0) {
            console.log(admin)
            if (admin[0].adminpassword != req.body.adminpassword) {
                console.log(req.body.adminpassword)
                req.session.message = "password not correct"
                res.redirect('/admin')
            }
            else {
                req.session.admin = admin
                return res.redirect('/admin/adminlogin')
            }

        } else {
            req.session.message = "Invalid Admin"
            res.redirect('/admin')
        }

    },
    getAdminlogout: (req, res) => {
        req.session.admin = null;
        return res.redirect('/admin')
    },
    getCategories: async (req, res) => {
        try {
            const category = await Category.find({ isDeleted: false })
            if (req.session.message) {
                const message = req.session.message
                req.session.message = ""
                return res.render('admin/categories', { message, category })
            }
            else {
                const message = req.session.message = ""
                return res.render('admin/categories', { message, category })
            }
        }
        catch (err) {
            console.log(err);
        }

    },
    getUsers: async (req, res) => {
        try {
            const register = await Register.find()
            return res.render('admin/user/userdata', { register })
        }
        catch (err) {
            console.log(err)
        }

    },
    blockUser: async (req, res) => {
        console.log('hi')
        try {
            const id = req.params.id
            const user = await Register.findById(id)
            console.log(user);

            if (user.isBlocked) {
                console.log('blocked');
                try {
                    await Register.findOneAndUpdate({ _id: id }, {
                        $set: {
                            isBlocked: false
                        }
                    })
                    return res.json({
                        successStatus: true,
                        redirect: '/admin/users'
                    })
                }
                catch (err) {
                    console.log(err)
                    return res.json({
                        successStatus: false
                    })
                }
            }
            else {
                console.log('not blocked')
                try {
                    const find = await Register.findOneAndUpdate({ _id: id }, {
                        $set: {
                            isBlocked: true
                        }
                    })
                    console.log(find)
                    console.log('done');
                    return res.json({
                        successStatus: true,
                        redirect: '/admin/users'
                    })
                }
                catch (err) {
                    console.log(err)
                    return res.json({
                        successStatus: false
                    })

                }
            }
        }
        catch (error) {
            console.log(error)
        }
    },

    getProducts: async (req, res) => {
        try{
            const products =await Products.find({isDeleted:false}).populate('categoryId')
            return res.render('admin/product/product-details',{products})
        }
        catch(err){
            console.log(err)
        }
        
    },
    getAddproducts: async (req, res) => {
        const category = await Category.find({ isDeleted: false })
        return res.render('admin/product/product-add', { category })
    },
    getEditproducts:async(req,res)=>{
        const category=  await Category.find()
        const products = await Products.findById(req.params.id)
        
        return res.render('admin/product/product-edit',{category,products})
    },
    getOrders: (req, res) => {
        return res.render('admin/order')
    },


    addCategory: async (req, res) => {
        try {
            const storecategory = new Category({
                categoryname: req.body.category
            })
            const category = await Category.find({ categoryname: req.body.category })
            if (category.length == 0) {
                try {
                    await storecategory.save()
                    return res.redirect('/admin/categories')
                }
                catch (error) {
                    req.session.message = error.errors.categoryname.properties.message

                    return res.redirect('/admin/categories')
                }
            } else {
                req.session.message = "Category already exist"
                res.redirect('/admin/categories')

            }
        }
        catch (err) {
            console.log(err);
        }
    },


    deleteCategory: async (req, res) => {
        try {
            const id = req.params.id
            await Category.findOneAndUpdate({ _id: id }, {
                $set: {
                    isDeleted: true
                }
            })
            return res.json({
                successStatus: true,
                redirect: '/admin/categories'
            })
        }
        catch (err) {
            console.log(err);
        }
    },

    addProducts: async (req, res) => {
        try {
            const images =[];
            for(key in req.files){
                const paths = req.files[key][0].path
                images.push(paths.slice(7))
            }
            const storeproducts = new Products({
                productname: req.body.productname,
                color: req.body.colour,
                size: req.body.size,
                price: req.body.price,
                description: req.body.description,
                totalStoke: req.body.totalstoke,
                categoryId: req.body.categoryId,
                images : images
            })
            try {
                await storeproducts.save()
                return res.redirect('/admin/products')
            }
            catch (error) {
                console.log(error);
                return res.redirect('/admin/products/addproducts')
            }
        }
        catch (err) {
            console.log(err);
        }
    },
    deleteProduct: async(req,res)=>{
        try{
          const id =  req.params.id
         await Products.findOneAndUpdate({_id : id},{
            $set: {
                isDeleted:true
            }
         })
         return res.json ({
            successStatus :true,
            redirect :'/admin/products'
         })
         }
        catch(err){
            console.log(err);
        }
    },
    editProduct: async(req,res)=>{
        try{
        const  id = req.params.id
        const images =[];
            for(key in req.files){
                const paths = req.files[key][0].path
                images.push(paths.slice(7))
            }
        console.log(id);
        console.log(req.body)
        const updatedProduct = await Products.findByIdAndUpdate({_id: id }, req.body )
        await Products.findByIdAndUpdate({_id : id},{
            images :images
        })
         return res.redirect('/admin/products')
        }
        catch(err){
            console.log(err);
        }
    }

}
