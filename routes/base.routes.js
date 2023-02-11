const express = require('express');

const router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/products');
});

router.get('/401', function(request, response) {
  response.status(401).render('shared/401');
});

router.get('/403', function(request, response) {
  response.status(403).render('shared/403');
});

module.exports = router;