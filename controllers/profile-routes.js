const router = require ('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require ('../models');
const withAuth = require ('../utils/auth');


router.get ('/', withAuth, (req, res) => {
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
        res.render('edit-post', { post, loggedIn: true }); 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})


router.get('/new', withAuth, (req, res) => {
    res.render('new-post'); 
});

module.exports = router;

