const express = require('express');

const productsController = require('../controllers/products.controller');

const router = express.Router();

router.get('/products', productsController.getAllProducts);

//! get single product with details
router.get('/products/:id', productsController.getProductDetails);

module.exports = router;