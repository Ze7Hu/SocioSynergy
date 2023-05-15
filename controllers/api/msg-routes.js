const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { User, Message } = require('../../models');

// Create new message
router.post('/', (req, res) => {
    Message.create({
        msg_content: req.body.msg_content,
        recipient_id: req.body.recipient_id,
        sender_id: req.body.sender_id,
    })
    .then(msgData => res.json(msgData))
    .catch(error => {
        res.status(500).json(error);
    })
});

// Get all user messages
router.get('/:id', (req, res) => {
    Message.findAll({
        where: {
            recipient_id: req.params.id,
        },
        order: [
            ['created_at', 'DESC']
        ],
        include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'username']
        },
        {
            model: User,
            as: 'recipient',
            attributes: ['id', 'username']
        }]
    }).then(msgData => {
        if(!msgData) {
            res.status(404).json({ message: 'No messages!'});
            return;
        }
        const msgs = msgData.map((msg) => msg.get({ plain: true }))
        console.log(msgs)
        res.render('messages', { msgs, logged_in: req.session.logged_in })

    })
})
module.exports = router;