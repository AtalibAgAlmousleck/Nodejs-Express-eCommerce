const path = require("path");

const express = require("express");
const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require("./data/database");
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerModdleare = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const updateCartPricesMiddleware = require('./middlewares/update-cart-price');
const notFoundMiddleware = require('./middlewares/not-found');

const authRoutes = require("./routes/auth.routes");
const productRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRouter = require('./routes/cart.routes');
const orderRouter = require('./routes/orders.routes');

const app = express();

//! activete the ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//! static files
app.use(express.static("public"));
app.use('/products/assets', express.static("product-data"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const sessionConfig = createSessionConfig();

//! config the session
app.use(expressSession(sessionConfig));
//! user the csurf security
app.use(csrf());

//! activate the cart
app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

//! not login user
app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);

app.use('/cart', cartRouter);


//! protected routes
//app.use(protectRoutesMiddleware);
app.use('/orders',protectRoutesMiddleware, orderRouter);
app.use('/admin',protectRoutesMiddleware, adminRoutes);

app.use(notFoundMiddleware);

//! Error handler
app.use(errorHandlerModdleare);

//! Connection to the database
db.connectToDatabase()
  .then(function () {
    app.listen(8080);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database");
    console.log(error);
  });
