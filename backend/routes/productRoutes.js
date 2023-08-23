import express from 'express';
// import asyncHandler from '../middleware/asyncHandler.js';
// import Product from '../model/productModel.js'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js'


const router = express.Router();
//productRoutes without using asyncHandler and we are fectching data from the backend

// router.get('/', (req, res) => {
//     res.json(products);
// })

// router.get('/:id', (req, res) => {
//     const product = products.find((p) => p._id === req.params.id);
//     res.json(product);
// })

//productRoutes using asyncHandler to replace try/catch blocks.
//Also, we are now fetching from database after we've seeded the database with 
//data from the backend. At this point we don't need to import the product.js file

// router.get('/', asyncHandler(async (req, res) => {
//     const products = await Product.find({})
//     res.json(products);
// }));

// router.get('/:id', asyncHandler(async(req, res) => {
//     const product = await Product.findById(req.params.id)
//     if (product){
//       return res.json(product);
//     }
//     else {
//       res.status(404);
//       throw new Error("Resource not found");
//     }
    
    
// }));

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);
router.post('/:id/reviews', protect, createProductReview)


export default router;