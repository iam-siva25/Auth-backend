require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); 
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected')

app.use(cors({ 
    // 🔑 FIX: Specify the exact frontend URL instead of the wildcard
    origin: 'http://localhost:3000', 
    
    // This must remain true to send/receive cookies
    credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
   .then(()=> console.log('MongoDb successfully connected'))
   .catch(err => console.log('MongoDb connection err', err))

// route registration
app.use('/api/auth', authRoutes);
app.use('/api/data', protectedRoutes)

app.listen(PORT, ()=>{
  console.log(`server running on ${PORT}`);
})