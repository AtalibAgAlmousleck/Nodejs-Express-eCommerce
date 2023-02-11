const Product = require('../models/product.model');
const Order = require('../models/order.model');

async function getProducts(require, response, next) {
  try {
    const products = await Product.findAll();
    response.render('admin/products/all-products', {products: products});
  }catch(error) {
    next(error);
    return;
  }
}

function getNewProduct(require, response) {
  response.render('admin/products/new-product');
}

async function createNewProduct(request, response, next) {
  const product = new Product({
    ...request.body,
    image: request.file.filename
  });
  
  try {
    await product.save();
  }catch(error) {
    next(error);
    return;
  }
  response.redirect('/admin/products');
}

async function getUpdateProduct(request, response, next) {
  try {
    const product = await Product.findById(request.params.id);
    response.render('admin/products/update-product', { product: product});
  }catch(error) {
    next(error);
  }
}

async function updateProduct(request, response, next) {
  const product = new Product({
    ...request.body,
    _id: request.params.id
  });

  if (request.file) {
    // replace the old image with the new one
    product.replaceImage(request.file.filename);
  }

  try {
    await product.save();
  }catch(error) {
    next(error);
    return;
  }
  response.redirect('/admin/products');
}

async function deleteProduct(request, response, next) {
  let product;
  try {
    product = await Product.findById(request.params.id);
    await product.remove();
  }catch(error) {
    return next(error);
  }
  //response.redirect('/admin/products');
  response.json({message: 'Delete product!'});
}

async function getOrders(request, response, next) {
  try {
    const orders = await Order.findAll();
    response.render('admin/orders/admin-orders', {
      orders: orders
    });
  }catch(error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ message: 'Order updated', newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder
}