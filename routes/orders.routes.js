const express = require('express');

const ordersControllers = require('../controllers/orders.controllers');

const router = express.Router();

router.post('/', ordersControllers.addOrder); //orders

router.get('/', ordersControllers.getOrders);

router.get('/success', ordersControllers.getSuccess);

router.get('failure', ordersControllers.getFailure);


module.exports = router;