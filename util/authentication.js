
function createUserSession(request, user, action) {
  request.session.uid = user._id.toString();
  request.session.isAdmin = user.isAdmin;
  request.session.save(action);
}

function destroyUserAuthSession(request) {
  request.session.uid = null;
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession
}