function handleErrors(error, request, response, next) {
  console.log(error);

  if (error.code === 404) {
    return response.status(404).render('shared/404');;
  }

  response.status(500).render('shared/500');
}

module.exports = handleErrors;