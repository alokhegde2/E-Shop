const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose =require('mongoose')

const {Product} = require('../models/product')

// GET method

router.get('/', async (req, res) => {

  //quering
  //localhost:3000/api/v1/products?categories=23325,54689
  let filter ={}
  if(req.query.categories){
    filter = {category:req.query.categories.split(',')}
  }


    const productList = await Product.find(filter).populate('category');
    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList)
  });

//GET single product

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category'); //to get addition details with foreign key or to connect two tables
  if(!product){
      res.status(500).json({success:false})
  }
  res.send(product)
});

//POST method

router.post('/', async (req, res) => {

    const category = await Category.findById(req.body.category)
    if(!category){
      return res.status(400).json({message:"Invalid Category"})
    }

    let product = new Product({
      name: req.body.name,
      description:req.body.description,
      richDescription:req.body.richDescription,
      image: req.body.image,
      brand:req.body.brand,
      price:req.body.price,
      category:req.body.category,
      countInStock: req.body.countInStock,
      rating:req.body.rating,
      numReviews:req.body.numReviews,
      isFeatured:req.body.isFeatured
    });
  
    product = await product.save()

    if(!product){
      return res.status(500).json({message:"Product cannot be created"})
    } 
    
    return res.send(product)

  });

  //UPDATE the product

  router.put('/:id',async(req,res) => {
    if(mongoose.isValidObjectId(req.params.id)){
      res.status(400).send('Invalid product id')
    }
    const category = await Category.findById(req.body.category)
    if(!category){
      return res.status(400).json({message:"Invalid Category"})
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          description:req.body.description,
          richDescription:req.body.richDescription,
          image: req.body.image,
          brand:req.body.brand,
          category:req.body.category,
          countInStock: req.body.countInStock,
          rating:req.body.rating,
          numReviews:req.body.numReviews,
          isFeatured:req.body.isFeatured
        },
        {new:true}
    )
     if(!product){
         return res.status(400).json({message:"The product cannot be created!"})
     }
     res.send(product)
})


//DELETE

router.delete('/:id',(req,res) =>{
  Product.findByIdAndRemove(req.params.id).then(product =>{
      if(product){
          return res.status(200).json({success:true,message:"The product is deleted"})
      } else{
          return res.status(404).json({success:false,message:"Product not found"})
      }
  }).catch(err =>{
      return res.status(400).json({success:false,error:err})
  })
})

//Product count

router.get('/get/count',async (req,res) =>{
  const productCount = await Product.countDocuments((count) => count)

  if(!productCount){
    res.status(500).json({success:false})
  }
  res.send({productCount:productCount})
})

//Featured product

router.get('/get/featured/:count',async (req,res) =>{
  const count = req.params.count ? req.params.count:0

  const products = await Product.find({isFeatured:true}).limit(+count)

  if(!products){
    res.status(500).json({success:false})
  }
  res.send({products:products})
})


  module.exports =router;