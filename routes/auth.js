const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
    body('password').isLength({ min: 5 }).withMessage('Password has to be valid.').trim(),
    ],
    authController.postLogin);

router.post('/signup',
    check("email").isEmail().withMessage("Please enter a valid email.")
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject("E-Mail exists already, please pick a different one.");
                }
            });
        }).normalizeEmail(),
    body("password", "Please enter a password with 5 or more characters.").isLength({ min: 5 }).trim(),
    body("confirmPassword", "Passwords do not match.").custom((value, { req }) => value === req.body.password),
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;