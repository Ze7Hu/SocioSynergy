// TODO: Create the following Handlebars templates: single-post, posts-comments
// Import Modules
const sequelize = require ('../config/connection');
const { Post, User, Comment } = require ('../models');
const router = require ('express').Router();
const withAuth = require ('../utils/auth');

// GET request for homepage to retrive all posts from database
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'profile_picture'],
                }
            ],
            order: [
                ['created_at', 'DESC']
            ]
        });
        const posts = postData.map((post) => post.get({ plain:true }));
        res.render('homepage', { 
            posts, 
            logged_in: req.session.logged_in, 
            username: req.session.username
        });
    } catch (error) {
        res.status(500).json(error);
    }
})
// router.get('/', (req, res) => {
//     Post.findAll({
//         attributes: [
//             'id',
//             'title',
//             'content',
//             'created_at'
//         ],
//         include: [{
//             model: Comment,
//             attributes: [
//                 'id',
//                 'text',
//                 'post_id',
//                 'user_id', 
//                 'created_at'
//             ],
//             include: {
//                 model: User,
//                 attributes: ['username']
//             }
//         },
//         {
//         model: User,
//         attributes: ['username']
//         }]
//     })
//     .then(data => {
//         const posts = data.map(post => post.get({ plain: true }))
//         console.log(posts)
//         res.render('homepage', { posts, loggedIn: req.session.loggedIn });
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });
// });

router.get('/profile', withAuth, (req, res) => {
    User.findOne({
        attributes: { exclude: ['password']},
        where: {
            id: req.session.user_id
        },
        include: [{
            model: Post,
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ]
        },
        {
            model: Comment,
            attributes: [
                'id',
                'text',
                'created_at'
            ],
            include: {
                model: Post,
                attributes: ['title']
            }
        },
        {
            model: Post,
            attributes: ['title'],
        }]
    })
    .then(userData => {
        if(!userData) {
            res.status(404).json({ message: 'A user with this id could not be found'});
            return;
        }
        const user = userData.get({ plain: true });
        console.log(user);
        res.render('profile', { 
            user, 
            logged_in: req.session.logged_in, 
            username: req.session.username,
            user_id: req.session.user_id,
            profile_picture: req.session.profile_picture  
        });
    })
    .catch(err => {
        console.log(err);
    });
});


// GET route for login endpoint
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});


// GET route for signup endpoint
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});


// GET request for specific post 
router.get('/post/:id', withAuth, (req, res) => {
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
    .then(data => {
        if (!data) {
            res.status(404).json({message: 'A post with this ID could not be found'});
            return;
        }
        const post = data.get({ plain: true});
        console.log(post);
        res.render('single-post', { post, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// GET endpoint to retrieve from database a specific post as well as the post's comments and user information
router.get('/posts-comments', (req, res) => {
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
    .then(data => {
        if(!data) {
            res.status(404).json({ message: 'A post with this ID could not be found'});
            return;
        }
        const post = data.get({ plain: true});

        res.render('posts-comments', { post, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;