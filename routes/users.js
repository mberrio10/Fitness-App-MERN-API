const User = require('../models/User');
const Post = require ('../models/Post')
const router = require ('express').Router();
const bcrypt = require('bcrypt');
const { json } = require('express');

/* Update */
router.put('/:id', async (req, res) => {

    // here im checking if is the correct user so they can make updates in their account
    if (req.body.userId === req.params.id) {
        // here if the user wants to update the password i will check that if the user is setting a new password then we will hash that password too
        if (req.body.password) {
            const salt = await bcrypt.genSalt(12);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try {
            // here is set inside the try block to catch the changes/updates in the user account and update them in the DB, i put the {new: true}
            // so i can see the new customer updated in my postman or admin dashboard
          const updatedUser = await User.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true });
          res.status(200).json(updatedUser);
        } catch (error) {
          res.status(500).json(error);  
        }
    } else {
        res.status(401).json("You can only update your account!")
    }
});

/*Delete*/
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id) {
        // here i will look for the user by ID and set a conditional so i can delete all their posts as well 
        const user = await User.findById(req.params.id)         
        if (user) {
            try {
                // here is the deleteMany method to delete all posts from user too!
                await Post.deleteMany({username: user.username})
                // here im going to find the user by ID and delete using   the findByIdAndDelete method 
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted...");
            } catch (error) {
                res.status(500).json(error);  
            }
        } else {
            res.status(404).json('User not found')
        }
    } else {
        res.status(401).json("You can only delete your account!")
    }
})

/*Get User*/
router.get('/:Id', async (req, res) => {
  try {
    const user = await User.findById(req.params.Id);
    const {password, ...others} = user._doc;
    res.status(200).json(others);
  } catch (error) {
      res.status(500).json(error)
  }
})

module.exports = router