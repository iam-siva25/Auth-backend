// Authentication/backend/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const User = require('../models/Users'); 

// @route   POST /api/auth/register
router.post('/register', async (req, res) =>{
    const {username, email, password} = req.body;

    try{
        // 1. Basic input validation (Prevents crashes from empty fields)
        if (!username || !email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields.' });
        }

        // 2. Check for duplicate email (assuming email is unique in schema)
        if(await User.findOne({email})){
            return res.status(400).json({msg:'User already exists with this email'});
        }
        
        // 3. Check for duplicate username (assuming username is unique in schema)
        if(await User.findOne({username})){
            return res.status(400).json({msg:'Username already taken'});
        }

        // 4. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        // 5. Create and save user to mongoDb
        const user = new User({username, email, password:hashedPassword});
        await user.save();

        // 6. Create JWT payload
        const payload = {user: {id: user.id}};

        // 7. Sign token and set cookie
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'}, (err, token) =>{
            if(err) throw err;
            
            res.cookie('token', token, {
                httpOnly: true, // Crucial for security
                secure: false, // Set to true in production over HTTPS
                sameSite: 'lax', 
                maxAge: 3600000 // 1 hour
            });
            
            // 8. CRITICAL: Send final success response to client
            res.status(200).json({ msg: 'Registration successful' });
        });

    } catch(err){
        console.error(err.message);
        // If a Mongoose validation error occurs, it's caught here
        res.status(500).send('Server error during registration'); 
    }
});


// @route   POST /api/auth/login
router.post('/login', async (req, res)=>{
    const {email, password} = req.body;

    try{
        // 1. Find user by email
        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({msg:'Invalid credentials'})
        }
        
        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg:'Invalid credentials'})
        }
        
        // 3. Create payload
        const payload = {user:{ id: user.id}};

        // 4. Sign token and set cookie
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'}, (err, token)=>{
            if(err) throw err;
            
            res.cookie('token', token, {
                httpOnly: true, 
                secure: false, 
                sameSite: 'lax', 
                maxAge: 3600000 
            });
            
            // 5. CRITICAL: Send final success response to client
            res.status(200).json({ msg: 'Login successful' });
        });

    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error during login');
    }
});

module.exports=router;