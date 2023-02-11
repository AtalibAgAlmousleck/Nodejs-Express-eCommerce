const Cart = require('../models/cart.model');

function initializeCart(request, response, next) {
  let cart;

  if (!request.session.cart) {
    cart = new Cart();
  } else {
    const sessionCart = request.session.cart;
   cart = new Cart(
    sessionCart.items,
    sessionCart.totalQuantity,
    sessionCart.totalPrice
   );
  }

  // make it available
  response.locals.cart = cart;

  next();
}

module.exports = initializeCart;