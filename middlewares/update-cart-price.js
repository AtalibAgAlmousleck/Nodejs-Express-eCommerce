async function updateCartPrices(request, response, next) {
  const cart = response.locals.cart;

  await cart.updatePrices();

  // request.session.cart = null;
  next();
}

module.exports = updateCartPrices;