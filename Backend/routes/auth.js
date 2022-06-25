const express = require('express')
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'RIshabhthEGre@T';

// Create a user using: POST "/api/auth". Doesn't require authentication
router.post('/createuser', [
    body('email', 'Enter a valid E-mail').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 5 }),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async(req, res) => {
    const errors = validationResult(req);

    // if there's any error, handle it with 'Bad Response(status code: 400)'
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // creating user =>
    try {
        let user = await User.findOne({ email: req.body.email });
        // console.log(user);
        // check if the user already exists =>
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);


        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = await jwt.sign(data, JWT_SECRET); // signing the 'id' of the user with my 'privateKey' so that the hacker can't crack it
        // console.log(jwtData);
        res.json({ authtoken });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured!");
    }
})

module.exports = router;