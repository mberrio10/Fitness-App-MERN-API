const router = require ('express').Router();
const bcrypt = require ('bcrypt');
const User = require ('../models/User');

/* REGISTER */

// here im creating the post request using the express router() to split our routes in to different files and manage them in small groups of routes that belong together
// making the app more modular that refers to how an application's endpoints (URIs) respond to client requests
// async and await keywords enable asynchronous, promise-based behavior to be written in a cleaner style, avoiding the need to explicitly configure promise chains.
router.post('/register', async (req, res)=> {
    try {
      const salt = await bcrypt.genSalt(12);
      const hashedPass = await bcrypt.hash(req.body.password, salt)
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass
      })
      
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

/* LOGIN */

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username});
    
    // here im checking whether if someone is trying to login then will check if that user exist or not, so if there is no user which means "true" 
    // then will log the statement on the right
    !user && res.status(400).json("wrong user ID or Password"); 
    
    // here im checking if the password typed is exist/correct that is coming from hashing the user from above
    const validate = await bcrypt.compare(req.body.password, user.password)
    !validate && res.status(400).json("wrong user ID or Password");

    // here im replacing the password with the spread operator (...) so when I/We pull the user records from the DB i will take other properties instead of passwords
    const {password, ...others} = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router 