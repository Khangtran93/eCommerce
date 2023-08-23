import Product from "../model/productModel.js"
import asyncHandler from "../middleware/asyncHandler.js"

// @desc    get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async(req,res) => {
    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;

    //create an object keyword with elements match the specified keyword: req.query.keyword
    const keyword = req.query.keyword 
    ? { name: {$regex: req.query.keyword, $options: 'i'}} 
    : {};

    //count the # of elements in that keyword object (empty if no req.query.keyword and it'll just return all products)
    const count = await Product.countDocuments({...keyword});

    //limit(pageSize): only returns two products everytime, and skip the pages before the current page,
    //meaning skip as many products as the pages before that contain
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1));
    console.log("products returned is ", products)
    res.json({products, page, pages: Math.ceil(count/pageSize)});
});

// @desc    get top rated products
// @route   GET /api/products/tops
// @access  Public
const getTopProducts= asyncHandler(async(req,res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3);
    if(products) {
        res.status(200).json(products);
    } 
    else {
        res.status(404);
        throw new Error("Products not found");
    }
    }
)

// @desc    get product by Id
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
        return res.json(product);
    }
    else {
        res.status(404);
        throw new Error("Product not found");
    }
})

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admim
const createProduct = asyncHandler(async(req, res, next) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: "Sample description"
    })

    const createdProduct = await product.save();
    res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admim
const updateProduct = asyncHandler(async(req, res, next) => {
    // const product = await Product.findById(req.params.id)
    const { name, price, image, description, category, brand, countInStock } = req.body;

    const product = await Product.findById(req.params.id)
    if (product) {
        product.name = name;
        product.price = price;
        product.image = image;
        product.description = description;
        product.category = category;
        product.brand = brand;
        product.countInStock = countInStock;
        
        const updatedProduct = product.save();
        res.status(201).json(updatedProduct);
    }
    else {
        res.status(404);
        throw new Error("Product not found when retrieve")
    }
})


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admim
const deleteProduct = asyncHandler(async(req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(product){
        await Product.deleteOne({_id: product._id});
        res.status(200).json("Product deleted")
    }
    else {
        res.status(404);
        throw new Error("Resource not found");
    }
})

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async(req, res) => {
    //destructure the comment and rating part of req.body
    const { rating, comment } = req.body;
    //find product in database
    const product = await Product.findById(req.params.id);
    //if product exists, then
    if(product){
        //check if that user in req.user._id already review that item
        const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString())
        

        //if alreadyReviewed, throw an error (a user can't review a product more than once)
        if(alreadyReviewed){
            res.status(400);
            throw new Error("Product already reviewed")
        }
        else {
            // if not create a new review object
            const review = {
                user: req.user._id,
                name: req.user.name,
                rating: Number(rating),
                comment,
            }

            //pushing object review to array reviews of product (based on the product's structure)
            product.reviews.push(review);
            //update the numReviews for that product
            product.numReviews = product.reviews.length;
            //update the rating for that product
            product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0)/product.reviews.length;
            //save product to database
            await product.save();
            //response
            res.status(201).json("Review added");

        }
    }
    else {
        res.status(404);
        throw new Error("Product not found");
    }
})

export {getProducts, 
    getProductById, 
    getTopProducts,
    createProduct, 
    updateProduct, 
    deleteProduct, 
    createProductReview}