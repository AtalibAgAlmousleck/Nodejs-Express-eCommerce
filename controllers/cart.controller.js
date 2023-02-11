const Product = require("../models/product.model");

function getCart(request, response) {
  response.render('customer/cart/cart');
}

async function addCartItem(request, response, next) {
  let product;
  try {
    product = await Product.findById(request.body.productId);
  } catch (error) {
    next(error);
    return;
  }
  const cart = response.locals.cart;

  cart.addItem(product);
  //! save back the updated item to the session
  request.session.cart = cart;

  response.status(201).json({
    message: 'Cart updated',
    newTotalItems: cart.totalQuantity, //totalQuantity
  });
}

function updatedCartItem(request, response) {
  const cart = response.locals.cart; // updatedCartItem

  const updatedItemData = cart.updatedItem(
    request.body.productId, 
    +request.body.quantity);

  request.session.cart = cart;

  response.json({
    message: 'Item updated',
    updateCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updateItemPrice: updatedItemData.updateItemPrice,
    }
  });
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updatedCartItem: updatedCartItem
};
