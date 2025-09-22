const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken'); 
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /api/auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const userPayload = {
            userId: req.user.id,
            role: req.user.role,
            name: req.user.name,
            email: req.user.email,
        };

        
        const token = jwt.sign(
            userPayload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
    }
);

module.exports = router;