// controller actions
module.exports.signup_get = (req, res) => {
  res.send('signup');
}

module.exports.login_get = (req, res) => {
  res.send('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  res.send('new signup');
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  res.send('user login');
}