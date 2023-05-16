const router = require('express').Router();
const { Comment } = require ('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Comment.findAll ({}) 
    .then(data => res.json(data))
    .catch (err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/:id', (req, res) => {
    Comment.findAll({
        where: {
            id: req.params.id
        }
    })
    .then(commentData => res.json(commentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.post('/', withAuth, (req, res) => {

    if(req.session.logged_in) { 
        Comment.create({
            text: req.body.text,
            post_id: req.body.post_id,
            user_id: req.session.user_id,
        })
        .then(commentData => {
            console.log(commentData)
            res.json(commentData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    }

});

router.put('/:id', withAuth, (req, res) => {
    Comment.update({
        text: req.body.text
    },
    {
        where: {
            id: req.params.id
        }
    })
    .then (commentData => {
        if(!commentData) {
            res.status(404).json({ message: 'A comment with this ID could not be found'});
            return;
        }
        res.json(commentData);
    }).catch (err => {
        console.log(err);
        res.status(500).json(err);
    });
});


router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then (commentData => {
        if(!commentData) {
            res.status(404).json ({ message: 'A comment with this ID could not be found' });
            return;
        }
        res.json({ message: 'Comment successfully deleted' });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;

