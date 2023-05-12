// TODO:  Create new-post Handlebars template
// Import Modules
const router = require ('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require ('../models');
const withAuth = require ('../utils/auth');

// GET endpoint to render user's profile and all their posts
router.get ('/', withAuth, (req, res) => { // withAuth to ensure user is logged in before having acces to this page
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [{
            model: Comment,
            attributes: [
                'id',
                'text',
                'post_id',
                'user_id',
                'created_at'
             ],
             include: {
                model: User,
                attributes: ['username']
             }
        },
        {
            model: User,
            attributes: ['username']
        }]
    })
    .then (data => {
        const posts = data.map (post => post.get ({ plain: true}));
        res.render('profile', { posts, loggedIn: true });
    })
    .catch (err => {
        console.log (err);
        res.status(500).json(err);
    });
});

// GET route to edit a post with a specific ID
router.get ('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'content',
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
                'text',
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
    .then(data => {
        if(!data) {
            res.status(404).json ({ message: 'A post with this ID could not be found' });
            return;
        }
        const post = data.get({ plain: true });
        res.render('edit-post', { post, loggedIn: true }); // If post is found, render edit-post Hanldebars template
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

// GET route to render the new post form
router.get('/new', withAuth, (req, res) => {
    res.render('new-post'); 
});

module.exports = router;

