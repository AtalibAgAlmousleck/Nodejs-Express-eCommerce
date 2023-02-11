function addCsrfToken(request, response, next) {
  response.locals.csrfToken = request.csrfToken();
  next();
}

module.exports = addCsrfToken;