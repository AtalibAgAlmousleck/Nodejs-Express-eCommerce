function protectRoutes(request, response, next) {

  if (!response.locals.isAuth) {
   return response.redirect('/401'); // Not Authenticated
  }

  if (request.path.startsWith('/admin') && !response.locals.isAdmin) {
   return response.redirect('/403'); // Not Authorized
  }

  next();

}

module.exports = protectRoutes;