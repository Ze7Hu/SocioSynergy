const router = require('express').Router();
const { User, Post, Comment } = require('../../models');


// GET route to retrieve all users from the database excluding their passwords
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password']}
    })
    .then(userData => res.json(userData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// GET route to retrieve a specific user for a given id including the user's posts, comments
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password']},
        where: {
            id: req.params.id
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
                'comment_text',
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
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
    });
});


// POST route to create a new user with the given username and password
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(userData => {
        req.session.save(() => { // Save the user's session data in the server-side session store
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;

            res.json(userData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// POST route to log in a user with a given username and password. It sets a session for the logged in user
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(userData => {
        if(!userData) {
            res.status(400).json({ message: 'A user with this ID could not be found'});
            return;
        }
        const validPassword = userData.checkPassword(req.body.password);

        if(!validPassword) {
            res.status(400).json({ message: 'Icorrect password. Please try again' });
            return;
        }
        req.session.save(() => { // Save the user's session data in the server-side session store
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;

            res.json({ user: userData, message: 'You are now logged in'});
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// POST route to log out the currently logged in user by destroying their session
router.post('/logout', (req, res) => {
    if(req.session.loggedIn){
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end(); // If the user is not logged in, send a 404 'Not Found' status code to the client
    }
});

// PUT route to update a user's record in the database
router.put ('/:id', (req, res) => {
    User.update(req.body, { // Call User.update() method passing two arguments: the req.body object with the new values and the where property specifying what user to update
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(userData => {
        if(!userData) {
            res.status(404).json({ message: 'A user with this ID could not be found'});
            return;
        }
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err); // If an error occurs during the update, send a 500 response
    });
});


// DELETE route to delete a user for a specific ID
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(userData => {
        if(!userData) {
            res.status(404).json({ message: 'A user with this ID could not be found' });
            return;
        }
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;