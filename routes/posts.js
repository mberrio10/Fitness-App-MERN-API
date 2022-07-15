const router = require('express').Router(   );
const Post = require("../models/Post");
// const User = require("../models/User");

/* Create Post */
router.post('/', async (req, res) => {
    // here im creating the newPost variable from the Post schema model, 
    // where is going to receive from the body what the user is submitting
    const newPost = new Post(req.body);
    try {
        // here im saving the newPost in to the DB
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
})

/* Update Post */

router.put ('/:id', async (req, res) => {
    try {
        // here i create the constant that is going to hold the post that im updating
        const post = await Post.findById(req.params.id);

        // then here im going to set a condition that is going to make sure this post belongs to the user that is updating
        if (post.username === req.body.username) {
            try {
                // and here once the condition is true then is going to use the method to find and update the post
                const updatedPost = await Post.findByIdAndUpdate (req.params.id, {$set:req.body},{new:true});
                res.status(200).json(updatedPost);
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(401).json('You can only update your Posts!')
        }
    } catch (error) {
        res.status(500).json(error);    
    }
})

/* Delete Post */

router.delete ('/:id', async (req, res) => {
    try {
        // here i create the constant that is going to hold the post that im deleting
        const post = await Post.findById(req.params.id);

        // then here im going to set a condition that is going to make sure this post belongs to the user that is deleting
        if (post.username === req.body.username) {
            try {
                // and here once the condition is true then i can go straight to delete because in line 48 we already found the post
                await post.delete();
                res.status(200).json("Post is deleted!");
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(401).json('You can only delete your Posts!')
        }
    } catch (error) {
        res.status(500).json(error);    
    }
})

/* Get Post */

router.get('/:Id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.Id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error)
    }
})

/* Get All Posts  */

router.get('/', async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
        let posts;
        if (username) {
            posts =await Post.find({username});
        } else if (catName) {
            posts = await Post.find ({
                categories: {
                    $in:[catName]
                }
            })
        } else {
            posts = await Post.find()
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router