const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/Users')


router.get('/profile', auth, async (req, res) =>{
  try{
    const user = await User.findById(req.user.id).select('-password')
    res.json({
      message: "Access garanted! this data comes from MongoDb",
      user: {id: user._id, username: user.username, email: user.email}
    })
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }

});

module.exports = router;