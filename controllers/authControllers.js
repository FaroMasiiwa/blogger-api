const User      = require('../models/User');


// controller actions
module.exports.signup_get = (req, res) => {
  res.send('signup');
}

module.exports.login_get = (req, res) => {
  res.send('login');
}

module.exports.signup_post = async (req, res) => {
  const { firstName, lastName, email, password  } = req.body;

  try {
    const user = await User.create({firstName, lastName, email, password });
    res.status(201).json(user);

  }
  catch(err) {
    console.log(err)
    res.status(400).send('error, uer not found')
  }


}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  res.send('user login');
}