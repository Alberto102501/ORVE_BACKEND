
exports.getUsers = (req, res) => {
  res.send('Get all users');
}

exports.createUser = (req, res) => {
  res.send('Create a user');
}

exports.updateUser = (req, res) => {
  res.send(`Update user with ID ${req.params.id}`);
}

exports.deleteUser = (req, res) => {
  res.send(`Delete user with ID ${req.params.id}`);
}