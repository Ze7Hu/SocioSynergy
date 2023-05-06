const router = require('express').Router();
const { Post, User, Comment} = require ('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// GET route to retrieve all posts sorted by the creation date in descending order, with the associated user and comments for each post
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        order: [
            ['created_at', 'DESC']
        ],
        include: [{
            model: User,
            attributes: ['username']
        },
        {
            model: Comment,
            attributes: [
                'id',
                'comment_text',
                'post_id',
                'user_id',
                'created_at'
            ],
            include: {
                model: User,
                attributes: ['username']
            }
        }]
    })
    .then(postData => res.json(postData.reverse())) // Reverse the order of the elements in the postData array so that the most recent posts will be displayed first instead of last
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// GET route to retrive a single post by its ID
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'content',
            'title',
            'created_at'
        ],
        include: [{
            model: User,
            attributes: ['username']
        },
        {
            model: Comment,
            attributes: [
                'id',
                'comment_text',
                'post_id',
                'user_id',
                'created_at'
            ],
            include: {
                model: User,
                attributes: ['username']
            }
        }]
    })
    .then(postData => {
        if(!postData) {
            res.status(404).json({ message: 'A post with this ID could not be found'});
            return;
        }
        res.json(postData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// POST route to create a new post requiring authentication
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    })
    .then(postData => res.json(postData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// PUT route to update a post with a specific ID requiring authentication
router.put('/:id', withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
        content: req.body.content
    },
    {
        where: {
            id: req.params.id
        }
    })
    .then(postData => {
        if(!postData) {
            res.status(404).json({ message: 'A post with this ID could not be found'})
            return;
        }
        res.json(postData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// DELETE route to delete a post with a specific ID
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(postData => {
        if(!postData){
            res.status(404).json({ message: 'A post with this ID could not be found'});
            return
        }
        res.json({ message: 'Post successfully deleted' }); 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;