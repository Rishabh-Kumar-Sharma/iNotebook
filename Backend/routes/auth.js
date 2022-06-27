const express = require('express')
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = 'RIshabhthEGre@T';

// ROUTE_1: Create a user using: POST "/api/auth". Doesn't require authentication
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
        res.status(500).send("Internal Server Error!");
    }
})

// ROUTE_2: Authenticate the user using : POST "/api/auth/login" : No Login required
router.post('/login', [
    body('email', 'Enter a valid E-mail').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ error: "Please login with correct credentials" });
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare)
            return res.status(400).json({ error: "Please login with correct credentials" });
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = await jwt.sign(data, JWT_SECRET);
        res.json({ authtoken });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

// ROUTE_3: Authenticate the user using : POST "/api/auth/getuser" : Login required
router.post('/getuser', fetchUser, async(req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error!");
    }
});
module.exports = router;