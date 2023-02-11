const stripe = require('stripe')('sk_test_51MY0l3ApsEVeEWIadaiDpQUlDX31F77OQLSIAm1YITRw4Huc6HbjdSmhJpefNmL6gLcVguaUAOyyIWziA7hrttx000l4alPE29');
//sk_test_51MY0l3ApsEVeEWIadaiDpQUlDX31F77OQLSIAm1YITRw4Huc6HbjdSmhJpefNmL6gLcVguaUAOyyIWziA7hrttx000l4alPE29
const Order = require("../models/order.model");
const User = require("../models/user.model");

async function getOrders(request, response, next) {
  try {
    const orders = await Order.findAllForUser(response.locals.uid);
    response.render('customer/orders/all-orders', { orders: orders });
  }catch(error) {
    next(error);
  }
}

async function addOrder(request, response, next) {
  const cart = response.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(response.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }
  request.session.cart = null;

  //! Stripe Service API's
  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map(function(item) {
     return {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        //price: '{{PRICE_ID}}',
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.title
          },
          unit_amount: +item.product.price.toFixed(2) * 100
        },
        quantity: item.quantity,
      }
    }),
    mode: 'payment',
    success_url: `http://localhost:8080/orders/success`,
    cancel_url: `http://localhost:8080/orderser/failure`,
  });

  response.redirect(303, session.url);

  //response.redirect('/orders');
}

function getSuccess(request, response) {
  response.render('customer/orders/success')
}

function getFailure(request, response) {
  response.render('customer/orders/failure')
}
module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getFailure: getFailure
};
